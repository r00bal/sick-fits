const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mutations = {
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
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
    const where = { id: args.id };
    // find the item
    const item = await ctx.db.query.item({ where }, `{id, title}`);
    // Check if they own the item or have the permissions
    //TODO
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
  }
};

module.exports = Mutations;
