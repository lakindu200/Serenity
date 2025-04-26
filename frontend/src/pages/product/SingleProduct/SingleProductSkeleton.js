
function SingleProductSkeleton() {
    return (
        <div className="single-product-container">
            <div className="skeleton-back-btn"></div>
            <div className="single-product">
                <div className="skeleton-image"></div>
                <div className="single-product-details">
                    <div className="skeleton-text large"></div>
                    <div className="skeleton-text short"></div>
                    <div className="skeleton-text medium"></div>
                    <ul className="skeleton-info">
                        <li className="skeleton-text long"></li>
                        <li className="skeleton-text long"></li>
                    </ul>
                    <div className="skeleton-text short"></div>
                    <div className="skeleton-add-to-cart">
                        <div className="skeleton-quantity"></div>
                        <div className="skeleton-button"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleProductSkeleton;