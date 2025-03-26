import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateOrderReport = (orders, clients) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    
    doc.setFontSize(20);
    doc.text('Serenity - Order Report', pageWidth/2, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth/2, 25, { align: 'center' });

    // Prepare table data
    const tableData = orders.map(order => {
        const clientId = order._id.toString();
        const client = clients[clientId];
        
        return [
            order._id,
            client ? client.name : 'N/A',
            `${order.length}m × ${order.width}m`,
            order.material,
            `${order.pillow_quantity} × ${order.pillow_type}`,
            `Rs. ${order.subtotal?.toFixed(2)}`,
            new Date(order.orderDate).toLocaleDateString()
        ];
    });

    // Generate table
    autoTable(doc, {
        head: [['Order ID', 'Client', 'Dimensions', 'Material', 'Pillows', 'Total', 'Date']],
        body: tableData,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    
    const totalAmount = orders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
    const totalOrders = orders.length;
    
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text('Summary:', 14, finalY + 15);
    doc.text(`Total Orders: ${totalOrders}`, 14, finalY + 25);
    doc.text(`Total Revenue: Rs. ${totalAmount.toFixed(2)}`, 14, finalY + 35);

    // Save PDF
    doc.save(`serenity_order_report_${new Date().toISOString().split('T')[0]}.pdf`);
};