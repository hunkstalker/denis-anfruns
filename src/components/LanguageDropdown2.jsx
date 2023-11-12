import { useEffect, useRef, useState } from "react";
import FlagES from './FlagES.jsx';

// Handler hook for when Outside click dropdown close
let useClickOutside = (handler) => {
  let domNode = useRef();

  useEffect(() => {
    let maybeHandler = (event) => {
      if (!domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const LanguageDropdown2 = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let domNode = useClickOutside(() => {
    setDropdownOpen(false);
  });

  return (
    <>
      {/* <!-- ====== Dropdowns Section Start --> */}
      <section class="pt-20 pb-10 lg:pt-[120px] lg:pb-20 dark:bg-dark">
        <div className='container'>
          <div className='flex flex-wrap -mx-4'>
            <div ref={domNode} className='w-full px-4 sm:w-1/2 lg:w-1/4'>
              <div className='py-8 text-center'>
                <div className='relative inline-block mb-8 text-left'>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center rounded-[5px] px-5 py-[13px] bg-dark dark:bg-dark-2 text-base font-medium text-default-950`}
                  >
                    <FlagES /> &nbsp;&nbsp;Español
                  </button>
                  <div
                    className={`shadow-1 dark:shadow-box-dark absolute left-0 z-40 mt-2 w-full rounded-md bg-dark dark:bg-dark-2 py-[10px] transition-all ${
                      dropdownOpen
                        ? 'top-full opacity-100 visible'
                        : 'top-[110%] invisible opacity-0'
                    }`}
                  >
                    <DropdownItem label='Español' href='/#' />
                    <DropdownItem label='Català' href='/#' />
                    <DropdownItem label='English' href='/#' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
};

export default LanguageDropdown2;

const DropdownItem = ({ label, href }) => {
  return (
    <a
      href={href}
      className='block py-2 px-5 text-base text-dark-5 hover:text-white'
    >
      {label}
    </a>
  )
};
