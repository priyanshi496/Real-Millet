import React from 'react'
import banner from '../assets/banner2.png'
import bannerMobile from '../assets/mobile_banner1.png'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

// Import your two new banner images
import specialBanner from '../assets/Gemini_Generated_Image_d5wbqmd5wbqmd5wb.png'
import processBanner from '../assets/Gemini_Generated_Image_r7fyv4r7fyv4r7fy.png'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => {
      return sub.category.some(c => c._id == id)
    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
    navigate(url)
  }

  return (
    <section className='bg-white'>
      {/* Top banner */}
      <div className='mx-auto'>
        <div className={`w-full h-full min-h-48 bg-blue-100 rounded ${!banner && "animate-pulse my-2"}`}>
          <img
            src={banner}
            className='w-full h-full hidden lg:block'
            alt='banner'
          />
          <img
            src={bannerMobile}
            className='w-full h-full lg:hidden'
            alt='banner'
          />
        </div>
      </div>

         {/**********  CATEGORIES SECTION **********/}
            <div className=' mx-auto p-4 my-10 '>
                <h2 className='text-3xl font-bold text-center text-slate-800 mb-2 mx-40'>Shop by Category</h2>
                <div className='bg-lime-900 rounded-lg shadow-lg mt-6 px-6 py-6'>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
                        {
                            loadingCategory ? (
                                new Array(6).fill(null).map((_, index) => (
                                    <div key={index + "loadingcategory"} className='bg-white rounded-lg border border-slate-200 p-2 animate-pulse'>
                                        <div className='bg-slate-200 w-full aspect-square rounded-md mb-2'></div>
                                        <div className='bg-slate-200 h-5 w-3/4 rounded-md'></div>
                                    </div>
                                ))
                            ) : (
                                categoryData.map(cat => (
                                    <div
                                        key={cat._id + "displayCategory"}
                                        className='bg-white rounded-lg border border-slate-200 cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
                                        onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                                    >
                                        <div className='w-full aspect-square flex items-center justify-center p-2'>
                                            <img
                                                src={cat.image}
                                                className='max-w-full max-h-full object-contain mix-blend-multiply'
                                                alt={cat.name}
                                            />
                                        </div>
                                        <div className='p-2'>
                                            <p className='font-bold text-green-700 capitalize group-hover:text-green-600 transition-colors'>
                                                {cat.name}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            </div>
            {/********** END CATEGORIES SECTION **********/}


      {/*  Banners  */}
      <div className='mx-auto px-4 my-8 flex flex-col gap-8'>

        {/* What's Special About Us */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={specialBanner}
            alt="What's special about us"
            className='w-full h-full'
          />
       
        </div>

      

      </div>

      {/* Category-wise products */}

      
        {
        categoryData?.map(c => (
          <CategoryWiseProductDisplay
            key={c?._id + "CategorywiseProduct"}
            id={c?._id}
            name={c?.name}
          />
        ))
      }
      {/* End of Category-wise products */}

      {/* Process Banner */}
    
          {/* Subscribe Now */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={processBanner}
            alt="Subscribe to freshly milled flours"
            className='w-full h-full'
          />
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Subscribe Now
            </h2>
            <p className="text-gray-700 mb-4">
              Continue enjoying the health benefits of our freshly milled flours — subscribe to your favourite products today.
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Subscribe
            </button>
          </div>
        </div>
    </section>
  )
}


export default Home
