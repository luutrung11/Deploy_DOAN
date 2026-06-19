import React, { useContext, useRef, useState } from "react";
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/nav_dropdown.png"

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
);

const Navbar = () => {
        const [menu, setMenu] = useState("shop");
        const [searchOpen, setSearchOpen] = useState(false);
        const [searchQuery, setSearchQuery] = useState("");
        const {getTotalCartItems} = useContext(ShopContext);
        const menuRef = useRef();
        const searchInputRef = useRef();
        const navigate = useNavigate();

        const dropdown_toggle = (e) =>{
            menuRef.current.classList.toggle('nav-menu-visible');
            e.target.classList.toggle('open');
        }

        const openSearch = () => {
            setSearchOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }

        const handleSearch = () => {
            const q = searchQuery.trim();
            if (!q) return;
            setSearchOpen(false);
            setSearchQuery("");
            navigate(`/search?q=${encodeURIComponent(q)}`);
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') handleSearch();
            if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(""); }
        }

    return (
        <div className="navbar">
            <div className="nav-logo">
                <img src={logo} alt="" />
                <p>HADES</p>
            </div>
            <img className="nav-dropdown" onClick={dropdown_toggle} src={nav_dropdown} alt="" />
            <ul ref={menuRef} className="nav-menu">
                <li onClick={()=>{setMenu("shop")}}><Link to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("mens")}}><Link to='/mens'>Men</Link>{menu==="mens"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("womens")}}><Link to='/womens'>Women</Link>{menu==="womens"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("kids")}}><Link to='/kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
            </ul>

            <div className={`nav-search${searchOpen ? ' nav-search-open' : ''}`}>
                {searchOpen
                    ? <input
                        ref={searchInputRef}
                        className="nav-search-input"
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => { if (!searchQuery.trim()) setSearchOpen(false); }}
                      />
                    : null
                }
                <button className="nav-search-btn" onClick={searchOpen ? handleSearch : openSearch} title="Tìm kiếm">
                    <SearchIcon />
                </button>
            </div>

            <div className="nav-login-cart">
                {localStorage.getItem('auth-token')?<Link to='/orders' style={{textDecoration:'none'}}><button>Orders</button></Link>:<></>}
                {localStorage.getItem('auth-token')?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
                :<Link to='/login'><button>Login</button></Link>}

                <div style={{position: 'relative'}}>
                    <Link to='/cart'><img src={cart_icon} alt="" /></Link>
                    <div className="nav-cart-count">{getTotalCartItems()}</div>
                </div>
            </div>
        </div>
    )
}
export default Navbar