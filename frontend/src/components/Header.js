import react from 'react';

function Header() {
    return (
        <header className="bg-dark text-light py-4 mb-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center" >  
          <h1 className="h3"  >SERENITY FORM </h1>
          <nav>
            <ul className = "nav nav-tabs ">
              <li className="nav-item">
                <a className="nav-link active align-item-" href="#home">Cart</a>
              </li>
            </ul> 
           
          </nav>
        </div>
      </div>
    </header> 
    );
    }

export default Header;