export default async function handler(req, res) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const order = JSON.parse(req.body);

  let total = 0;

  total += order.cookies1 * 24;
  total += order.cookies2 * 24;
  total += order.cookies3 * 24;

  total += order.banana * 23;
  total += order.coffee * 23;
  total += order.doublechoc * 23;

  total += order.babka1 * 27;
  total += order.babka2 * 27;

  if (order.delivery === "delivery") {
    total += 7;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Bria Bakery Order",
          },
          unit_amount: total * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://bria-bakery.vercel.app/success",
    cancel_url: "https://bria-bakery.vercel.app",
  });

  res.status(200).json({ url: session.url });
}
