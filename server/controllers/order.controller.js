import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
import mongoose from "mongoose";
import ProductModel from "../models/product.model.js"; 
import sendEmail from "../config/sendEmail.js";
import { orderConfirmationTemplate } from "../utils/orderConfirmationEmail.js";


export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt, deliveryCharge } = request.body;
    
    // Validate cart has items
    if (!list_items || list_items.length === 0) {
      return response.status(400).json({
        message: "Please buy something",
        error: true,
        success: false,
      });
    }

    // Validate address selection
    if (!addressId || addressId === "" || addressId === "undefined" || addressId === "null") {
      return response.status(400).json({
        message: "Please select a delivery address",
        error: true,
        success: false,
      });
    }

    // Verify address exists and belongs to user
    const address = await AddressModel.findOne({ _id: addressId, userId: userId, status: true });
    if (!address) {
      return response.status(400).json({
        message: "Invalid or inactive delivery address",
        error: true,
        success: false,
      });
    }

    // Validate address has required fields
    if (!address.address_line || !address.city || !address.state || !address.pincode || !address.country) {
      return response.status(400).json({
        message: "Please complete your address details",
        error: true,
        success: false,
      });
    }

    // 🔎 Stock check before placing order
    for (const item of list_items) {
      const product = await ProductModel.findById(item.productId._id);
      if (!product) {
        return response.status(404).json({
          message: `Product not found`,
          error: true,
          success: false,
        });
      }
      if (product.stock < item.quantity) {
        return response.status(400).json({
          message: `Insufficient stock for ${product.name}.`,
          error: true,
          success: false,
        });
      }
    }

    // ✅ If stock is sufficient → continue placing the order
    const payload = list_items.map((el) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });

    const generatedOrder = await OrderModel.insertMany(payload);

    // 🔻 Decrease stock after successful order
    for (const item of list_items) {
      await ProductModel.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // remove from cart
    await CartProductModel.deleteMany({ userId: userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    // Send confirmation email
    const user = await UserModel.findById(userId);
    if (user?.email) {
      const emailHtml = orderConfirmationTemplate({
        userName: user.name || "Customer",
        orderId: generatedOrder[0].orderId,
        orderItems: list_items.map(i => ({
          name: i.productId.name,
          quantity: i.quantity,
          price: i.productId.price
        })),
        totalAmt: totalAmt
      });

      await sendEmail({
        sendTo: user.email,
        subject: "Your Order has been placed! 🎉",
        html: emailHtml
      });
    }

    return response.json({
      message: "Order successfully placed",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmout);
  return actualPrice;
};


export async function paymentController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, addressId, totalAmt, deliveryCharge } = request.body;
    const user = await UserModel.findById(userId);
    
    // Validate cart has items
    if (!list_items || list_items.length === 0) {
      return response.status(400).json({
        message: "Please buy something",
        error: true,
        success: false,
      });
    }

    // Validate address selection
    if (!addressId || addressId === "" || addressId === "undefined" || addressId === "null") {
      return response.status(400).json({
        message: "Please select a delivery address",
        error: true,
        success: false,
      });
    }

    // Verify address exists and belongs to user
    const address = await AddressModel.findOne({ _id: addressId, userId: userId, status: true });
    if (!address) {
      return response.status(400).json({
        message: "Invalid or inactive delivery address",
        error: true,
        success: false,
      });
    }

    // Validate address has required fields
    if (!address.address_line || !address.city || !address.state || !address.pincode || !address.country) {
      return response.status(400).json({
        message: "Please complete your address details",
        error: true,
        success: false,
      });
    }

    // 🔎 Stock check before creating Stripe session
    for (const item of list_items) {
      const product = await ProductModel.findById(item.productId._id);
      if (!product) {
        return response.status(404).json({
          message: `Product not found`,
          error: true,
          success: false,
        });
      }
      if (product.stock < item.quantity) {
        return response.status(400).json({
          message: `Insufficient stock for ${product.name}.`,
          error: true,
          success: false,
        });
      }
    }

    // ✅ If stock is enough → continue Stripe checkout session
    const line_items = list_items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.productId.name,
          images: item.productId.image,
          metadata: { productId: item.productId._id },
        },
        unit_amount:
          pricewithDiscount(item.productId.price, item.productId.discount) *
          100,
      },
      adjustable_quantity: { enabled: true, minimum: 1 },
      quantity: item.quantity,
    }));

    // Add delivery charge as separate line item if applicable
    if (deliveryCharge > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Delivery Charge",
          },
          unit_amount: deliveryCharge * 100,
        },
        quantity: 1,
      });
    }

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: request.userId,
        addressId: addressId,
      },
      line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await Stripe.checkout.sessions.create(params);

  
    await CartProductModel.deleteMany({ userId: userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    // Send confirmation email 
    if (user?.email) {
      const emailHtml = orderConfirmationTemplate({
        userName: user.name || "Customer",
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        orderItems: list_items.map(i => ({
          name: i.productId.name,
          quantity: i.quantity,
          price: i.productId.price
        })),
        totalAmt: totalAmt
      });

      await sendEmail({
        sendTo: user.email,
        subject: "Your Payment was Successful – Order Placed!",
        html: emailHtml
      });
    }

    return response.status(200).json(session);
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      const payload = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_subtotal / 100),
        totalAmt: Number(item.amount_total / 100), 
      };

      productList.push(payload);
    }
  }

  return productList;
};

export async function webhookStripe(request, response) {
  // <<< ADDED LOG >>>
  console.log("--- Stripe Webhook Request Received ---");

  const sig = request.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // <<< ADDED LOG >>>
    console.log("Verifying webhook signature...");
    event = Stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log("✅ Signature verified.");
  } catch (err) {
    // <<< ADDED LOG >>>
    console.error("❌ Webhook signature verification failed.", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // <<< ADDED LOG >>>
  console.log(`Received event type: ${event.type}`);

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // <<< ADDED LOG >>>
      console.log("Processing checkout.session.completed event...");

      const session = event.data.object;
      const userId = session.metadata.userId;

      if (!userId) {
        console.error("❌ FATAL: userId not found in session metadata!");
        return response
          .status(400)
          .send("Webhook Error: Missing userId in metadata.");
      }

      console.log(`User ID found: ${userId}`);

      try {
        // ... (The rest of your logic for creating orders and clearing the cart)
        const lineItems = await Stripe.checkout.sessions.listLineItems(
          session.id
        );
        const orderProduct = await getOrderProductItems({
          lineItems: lineItems,
          userId: userId,
          addressId: session.metadata.addressId,
          paymentId: session.payment_intent,
          payment_status: session.payment_status,
        });

        console.log("Creating order in database...");
        const order = await OrderModel.insertMany(orderProduct);

        // 📨 Send confirmation email
        const user = await UserModel.findById(userId);
        if (user?.email && order.length > 0) {
          const emailHtml = orderConfirmationTemplate({
            userName: user.name || "Customer",
            orderId: order[0].orderId,
            orderItems: orderProduct.map(i => ({
              name: i.product_details.name,
              quantity: 1, // Stripe doesn't always return quantity properly
              price: i.subTotalAmt,
            })),
            totalAmt: order.reduce((sum, o) => sum + o.totalAmt, 0),
          });

          await sendEmail({
            sendTo: user.email,
            subject: "Your Payment was Successful – Order Placed!",
            html: emailHtml,
          });

          if (order && order.length > 0) {
            // Reduce stock of each product
            for (const item of orderProduct) {
              await ProductModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity || -1 } } // default to -1 if no quantity
              );
            }
          
            console.log("✅ Stock updated.");
            
            // Clear cart
            await CartProductModel.deleteMany({ userId: userId });
            await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
          }
          

          if (order && order.length > 0) {
            console.log(
              `✅ Order created successfully. Order ID: ${order[0].orderId}`
            );
            console.log("Clearing user cart...");
            await CartProductModel.deleteMany({ userId: userId });
            await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
            console.log("✅ Cart cleared.");
          }
        }
      }
      catch (dbError) {
        console.error("❌ Error during database update:", dbError);
        // Don't send a 400 back to Stripe here, because the event was valid.
        // Just log the error so you can fix it.
      }
      break;

    default:
      console.log(`- Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
}

export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId;

    const orderlist = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return response.json({
      message: "order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
