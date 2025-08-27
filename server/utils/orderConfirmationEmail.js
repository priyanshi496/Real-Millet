// utils/emailTemplates.js

export const orderConfirmationTemplate = ({ userName, orderId, orderItems, totalAmt }) => {
    const itemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
        <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;">₹${item.price}</td>
      </tr>
    `).join("");
  
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
      <div style="max-width:600px; margin:0 auto; background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="color:#4CAF50;">Thank you for your order, ${userName}!</h2>
        <p>Your order <strong>${orderId}</strong> has been successfully placed.</p>
        
        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
          <thead>
            <tr style="background:#f2f2f2;">
              <th style="padding:8px;border:1px solid #ddd;">Product</th>
              <th style="padding:8px;border:1px solid #ddd;">Qty</th>
              <th style="padding:8px;border:1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
  
        <h3>Total: ₹${totalAmt}</h3>
  
        <p>We’ll notify you once your order is shipped.</p>
        <p style="margin-top:20px;">Best Regards,<br><strong>RealMillet Team</strong></p>
      </div>
    </body>
    </html>
    `;
  };
  