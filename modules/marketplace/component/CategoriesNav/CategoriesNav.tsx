import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import ButtonCat from './ButtonCat';
import styles from '.././landingpage/productCardWrapper/product-card-wrapper.module.css';
import Image from 'next/image';
import more from '../../../../public/assets/ic_outline-arrow-back-ios.svg';
import menu from '../../../../public/assets/ic_outline-menu.svg';
import { useAuthentication } from '../../../../hooks/useAuthentication';
import { CategoryType } from '../filter/hooks/useCategory';

// import axios from 'axios';
type categories = {
  name: string;
  subcategories: [];
};

interface CategoriesNavProps {
  navItems: CategoryType[];
  isLoading: boolean;
}

const CategoriesNav = (props: CategoriesNavProps) => {
  const [active, setActive] = useState(-1);
  const [allCatActive, setAllCatActive] = useState(false);
  // const [categories, setCategories] = useState([]);

  const { authenticated } = useAuthentication();
  const { navItems } = props;
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const data = await axios.get('https://coral-app-8bk8j.ondigitalocean.app/api/category-name/');
  //       console.log(data);

  //       setCategories(data.categories);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   return () => {
  //     fetchCategories();
  //   };
  // }, []);

  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active >= 0) setAllCatActive(false);
  }, [active]);

  const handleActiveNav = (i: number) => {
    setActive(i);
  };

  const handleScrollLeft = () => {
    if (navContainerRef.current) {
      const scrollAmount = -150;
      navContainerRef.current.scrollTo({
        left: navContainerRef.current.scrollLeft - scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`font-ppReg shadow-sm -mt-4 px-4 py-5`}>
      <aside className="max-w-[1240px] mx-auto hidden xl:flex gap-8 items-center z-50">
        <button
          className={`${allCatActive ? 'text-brand-green-shade50' : ''}  items-center gap-1 whitespace-nowrap flex`}
          onClick={() => {
            setAllCatActive(true);
            setActive(-1);
          }}
        >
          <Link href="/marketplace/allcategories">All Categories</Link>
        </button>
        <div className={`overflow-x-scroll  ${styles['hide-scroll']}`} ref={navContainerRef}>
          <ul className={`list flex whitespace-nowrap gap-8 bg-white-100 text-base `}>
            {/*  */}
            {props.isLoading &&
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <li key={num} className="w-[100px] h-[20px] animate-pulse bg-custom-color32"></li>
              ))}
            {!props.isLoading &&
              Array.isArray(navItems) &&
              navItems.map((category, i: number) => {
                return (
                  <li key={i + 1} className="">
                    <ButtonCat active={active} handleActiveNav={handleActiveNav} category={category} index={i} />
                  </li>
                );
              })}
          </ul>
        </div>

        {navItems.length !== 0 && (
          <Image className="cursor-pointer" src={more} alt="move icon" onClick={handleScrollLeft} />
        )}
      </aside>
    </div>
  );
};

export default CategoriesNav;
