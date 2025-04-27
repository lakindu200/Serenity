import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import'./Add_custom_product.css';

function AddCustomProduct() {
  const navigate = useNavigate();
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [pillowType, setPillowType] = useState('');
  const [pillowSize, setPillowSize] = useState('');
  const [pillowColor, setPillowColor] = useState('');
  const [pillowQuantity, setPillowQuantity] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!length || !width || !color || !material || 
        !pillowType || !pillowSize || !pillowColor || !pillowQuantity) {
        alert("Please fill in all required fields");
        return;
    }

    const newProduct = { 
        length: Number(length),
        width: Number(width),
        color, 
        material,
        pillow_type: pillowType,
        pillow_size: pillowSize,
        pillow_color: pillowColor,
        pillow_quantity: Number(pillowQuantity),
        orderDate: new Date()
    };

    try {
        localStorage.setItem('tempProductData', JSON.stringify(newProduct));
        navigate('/custom/client-details'); // Update path to match route configuration
    } catch (err) {
        console.error('Error saving product data:', err);
        alert('Error saving product details. Please try again.');
    }
  };

  return (
    <div className="container mt-5">

      <div className="container1">Add Custom Product</div>

      <form onSubmit={handleSubmit}>
        <div className="card mb">
          <div className="card-header bg-light">
            <h4>Fabric Measurements</h4>
          </div>

          <div className="card-body">
            <div className="form-group">
              <label htmlFor="length">Length</label>
              <input
                type="number"
                className="form-control"
                id="length"
                placeholder="Enter in centimeters"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                required
              />
              
            </div>


            <div className="form-group mt-3">
              <label htmlFor="width">Width</label>
              <input
                type="number"
                className="form-control"
                id="width"
                placeholder="Enter in centimeters"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                required
              />
              <small className="text-muted">
                Enter length and widthth of fabric needed in inches. This will determine the horizontal dimension.<br/>
                Hight will be around 10 inches, will depend on the material type.<br/>
                price will be depends on material and calculated for 1*1 inches.<br/>
              </small>
            </div>
            

            <div className="form-group mt-3">
              <label htmlFor="color">Color</label>
              <input
                type="text"
                className="form-control"
                id="color"
                placeholder="Enter color name"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              />
              <small className="text-muted">
                select the desired color for your fabric. 
              </small>
            </div>

            <div className="form-group mt-3">
              <label htmlFor="material">Material Type</label>
              <select
                className="form-control"
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                required
              >
                <option value="">Select a material type</option>
                <option value="Innerspring Mattress">Innerspring Mattress</option>
                <option value="Memory Foam Mattress">Memory Foam Mattress</option>
                <option value="Hybrid Mattress">Hybrid Mattress</option>
              </select>
              <small className="text-muted mb-4 d-block">
                Choose the type of mattress material.Price will be specific to the material
              </small>
              
              {/* Material descriptions */}
              <div className="mt-2 small">
                <p className="mb-4"><strong>Innerspring Mattress (Budget-Friendly)</strong><br/>
                  - Uses Bonnell or Pocket Springs with PU Foam<br/>
                  - Affordable due to simple construction<br/>
                  - Commonly used in hotels and guest rooms</p>

                <p className="mb-4"><strong>Memory Foam Mattress (Mid-Range)</strong><br/>
                  - Uses High-Density Foam for comfort<br/>
                  - Offers pressure relief and motion isolation<br/>
                  - Features gel infusion technology<br/>
                   </p>

                <p className="mb-4"><strong>Hybrid Mattress (Premium)</strong><br/>
                  - Combines Springs with Memory Foam/Latex<br/>
                  - Provides superior durability and support<br/>
                  - Premium comfort and longevity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillow Section */}
        <div className="card">
          <div className="card-header bg-light">
            <h4 className="mb">Pillows</h4>
          </div>

          <div className="card-body">
            <div className="form-group">
              <label htmlFor="pillowType">Pillow Type</label>
              <select
                className="form-control"
                id="pillowType"
                value={pillowType}
                onChange={(e) => setPillowType(e.target.value)}
                
              >
                <option value="">Select a pillow type</option>
                <option value="decorative">Decorative</option>
                <option value="sleeping">Sleeping</option>
                <option value="orthopedic">Orthopedic</option>
              </select>
              <small className="text-muted">
                Choose the type of pillow based on its intended use. Decorative for aesthetics, 
                Sleeping for regular use, or Orthopedic for extra support.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="pillowSize">Pillow Size</label>
              <select
                className="form-control"
                id="pillowSize"
                value={pillowSize}
                onChange={(e) => setPillowSize(e.target.value)}
                
              >
                <option value="">Select a size</option>
                <option value="small">Small (16" × 16")</option>
                <option value="medium">Medium (20" × 20")</option>
                <option value="large">Large (24" × 24")</option>
              </select>
              <small className="text-muted">
                Select the size that best fits your needs. Measurements are in inches (width × length).
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="pillowColor">Pillow Color</label>
              <input
                type="text"
                className="form-control"
                id="pillowColor"
                placeholder="Enter pillow color"
                value={pillowColor}
                onChange={(e) => setPillowColor(e.target.value)}
                
              />
              <small className="text-muted">
                Specify the color for your pillows. Consider matching or complementing your fabric color.
              </small>
            </div>
            

            <div className="form-group">
              <label htmlFor="pillowQuantity">Quantity</label>
              <input
                type="number"
                className="form-control"
                id="pillowQuantity"
                placeholder="Enter quantity"
                value={pillowQuantity}
                onChange={(e) => setPillowQuantity(e.target.value)}
                min="1"
               
              />
              <small className="text-muted">
                Enter the number of pillows you need. Minimum order quantity is 1.
              </small>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-4 ">Proceed</button>
      </form>
    </div>
  );
}

export default AddCustomProduct;

