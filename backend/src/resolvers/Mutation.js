const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { transport, makeANiceEmail } = require('../mail');
const { randomBytes} = require('crypto');
const { promisify } = require('util');
const { hasPermission } = require('../utils')



const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // this is how we create relationship between the Item and the User
          user:  {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );
    console.log(item);
    return item;
  },
  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove the IDs from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    // throw new Error('You arrent allowed!!!!')
    const where = { id: args.id };
    // find the item
    const item = await ctx.db.query.item({ where }, `{id, title user { id }}`);
    // Check if they own the item or have the permissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission))

    if (!ownsItem && !hasPermissions) {
      throw new Error('You don\'t have permission to do that')
    }
    // delete it!
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parenr, args, ctx, info) {
    // lowercase the email
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    );
    // create db token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // Finally we return the user to the Browser
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with the email
    const user = await ctx.db.query.user({where: { email } })
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. check if their password is correct
    const valid = await bcrypt.compare(password, user.password)
    if(!valid) { 
      throw new Error('Invalid Password!');
    }
    // 3. generate the JWT Token
    const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    console.log(ctx.resposne);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // 5. Return the user
    return user;
  },
  signout( parent,args, ctx, info ) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!'};
  },

  async requestReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2. Set a reset token and expiry on that user
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });
    
    // 3. Email them that reset token
    const mailRes = await transport.sendMail({
      from: 'frontendpit@gmail.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${process.env
        .FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
    });

    // 4. Return the message
    return { message: 'Thanks!' };
  },
  async resetPassword(parent,args, ctx, info) {
    // 1. check if the password match
    if (args.password !== args.confirmPassword) {
      throw new Error('Yo Password don\'t match!');
    }
    // 2. check if its a legit reset token
    // 3. check if its expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken, 
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if(!user) {
      throw new Error('This error is either invalid or expired')
    }
    // 4. Hash theie new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null, 
      }
    })
    // 6. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id}, process.env.APP_SECRET)
    // 7. Set the JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // 8. return the new user
    return updatedUser
    // 9. have a beer

  },

  async updatePermissions(parent, args, ctx, info) {
    // 1. check if they are logged in
    if(!ctx.request.userId) {
      throw new Error('You must be logged in!')
      }
    // 2. Query the qurrent user
     const currentUser = await ctx.db.query.user({
       where: {
         id: ctx.request.userId,
       }
     }, info
     );
    // 3. Check if they have permmissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])
    // 4. Update the permissions
    return ctx.db.mutation.updateUser({
      data: {
        permissions: {
          set: args.permissions,
        }
      },
      where: {
        id: args.userId,
      },

    }, info)
  }
};

module.exports = Mutations;
