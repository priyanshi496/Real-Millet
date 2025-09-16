import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from 'react-router-dom';
import footerBackground from '../assets/footer-background.png'; // <-- Import the image

const Footer = () => {
  return (
    <footer className='bg-white pt-10'>
      <div className='container mx-auto px-6'>
        {/* Top section with links and newsletter */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          
          {/* Brand Info */}
          <div>
            <h2 className='text-xl font-bold text-green-800 mb-3'>RealMillet</h2>
            <p className='text-slate-600 text-sm'>
              Bringing fresh, organic millet flour straight from the farm to your table.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='font-semibold text-slate-700 mb-3'>Quick Links</h3>
            <ul className='space-y-2 text-sm'>
              <li><Link to="/about" className='text-slate-600 hover:text-green-700'>About Us</Link></li>
              <li><Link to="/products" className='text-slate-600 hover:text-green-700'>Products</Link></li>
              <li><Link to="/contact" className='text-slate-600 hover:text-green-700'>Contact Us</Link></li>
              <li><Link to="/faq" className='text-slate-600 hover:text-green-700'>FAQ</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className='font-semibold text-slate-700 mb-3'>Follow Us</h3>
            <div className='flex items-center gap-4 text-2xl'>
              <a href='#' className='text-slate-500 hover:text-green-700'><FaFacebook /></a>
              <a href='#' className='text-slate-500 hover:text-green-700'><FaInstagram /></a>
              <a href='#' className='text-slate-500 hover:text-green-700'><FaLinkedin /></a>
              <a href='#' className='text-slate-500 hover:text-green-700'><FaTwitter /></a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className='font-semibold text-slate-700 mb-3'>Join Our Newsletter</h3>
            <p className='text-slate-600 text-sm mb-2'>Get updates on new products and special offers.</p>
            <form className='flex'>
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full p-2 border border-slate-300 rounded-l-md outline-none focus:ring-1 focus:ring-green-600"
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Farm Illustration Background */}
      <div 
        className='w-full h-48 bg-no-repeat bg-cover bg-center'
        style={{ backgroundImage: `url(${footerBackground})` }}
        loading = "lazy"
      >
        {/* This div is just for the background image */}
      </div>

      {/* Bottom bar */}
      <div className='bg-slate-100'>
        <div className='container mx-auto p-4 text-center text-sm text-slate-500'>
          <p>© {new Date().getFullYear()} RealMillet. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;