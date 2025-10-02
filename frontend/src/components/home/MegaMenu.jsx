import Link from "next/link";


export default function MegaMenu({ grouped, mobile }) {
    const desiredOrder = [
      'SHOP BY RECIPIENT',
      'SHOP BY OCCASION',
      'SHOP BY INTEREST',
      'BY PRICE',
    ];
  if (mobile) {
    return (
      <div className='space-y-6 bg-gray-50 p-4 rounded-lg'>
        {Object.entries(grouped)
          // sort keys by our custom array
          .sort(([a], [b]) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b))
          .map(([mainTitle, cats]) => (
            <div key={mainTitle}>
              <h3 className='font-semibold mb-3 text-sm tracking-wide text-gray-900'>
                {mainTitle}
              </h3>
              <ul className='space-y-2 pl-2'>
                {cats.map((cat) => (
                  <li key={cat._id}>
                    <a
                      href={`/${cat.slug}`}
                      className='text-sm text-gray-600 hover:text-pink-600 transition-colors block py-1'
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        <div>
          <h3 className='font-semibold mb-3 text-sm tracking-wide text-gray-900'>
            MORE
          </h3>
          <ul className='space-y-2 pl-2'>
            <li>
              <a
                href='/personalised-gifts'
                className='text-sm text-gray-600 hover:text-pink-600 block py-1'
              >
                PERSONALISED GIFTS
              </a>
            </li>
            <li>
              <a
                href='/home-decor'
                className='text-sm text-gray-600 hover:text-pink-600 block py-1'
              >
                HOME DECOR GIFTS
              </a>
            </li>
            <li>
              <a
                href='/best-sellers'
                className='text-sm text-gray-600 hover:text-pink-600 block py-1'
              >
                BEST SELLERS
              </a>
            </li>
            <li>
              <a
                href='/gift-cards'
                className='text-sm text-gray-600 hover:text-pink-600 block py-1'
              >
                GIFT CARDS
              </a>
            </li>
            <li>
              <a
                href='/new-arrivals'
                className='text-sm text-gray-600 hover:text-pink-600 block py-1'
              >
                NEW ARRIVALS
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className='absolute -left-80 w-[1100px] bg-white shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50 top-full'>
      <div className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-5 gap-8'>
          {Object.entries(grouped)
            // sort keys by our custom array
            .sort(
              ([a], [b]) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b)
            )
            .map(([mainTitle, cats]) => (
              <div key={mainTitle}>
                <h3 className='mb-1 text-base tracking-wider text-[#4F4F4F] pb-2'>
                  {mainTitle}
                </h3>
                <ul className='space-y-2.5'>
                  {cats.map((cat) => (
                    <li key={cat._id}>
                      <Link
                        href={`/${cat.slug}`}
                        className='text-base text-black hover:text-pink-600 transition-colors duration-150 block leading-relaxed'
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          <div>
            <h3 className='font-semibold mb-4 text-xs tracking-wider text-gray-900 pb-2'>
              MORE
            </h3>
            <ul className='space-y-2.5'>
              <li>
                <a
                  href='/personalised-gifts'
                  className='text-sm text-gray-700 hover:text-pink-600 transition-colors block leading-relaxed'
                >
                  PERSONALISED GIFTS
                </a>
              </li>
              <li>
                <a
                  href='/home-decor'
                  className='text-sm text-gray-700 hover:text-pink-600 transition-colors block leading-relaxed'
                >
                  HOME DECOR GIFTS
                </a>
              </li>
              <li>
                <a
                  href='/best-sellers'
                  className='text-sm text-gray-700 hover:text-pink-600 transition-colors block leading-relaxed'
                >
                  BEST SELLERS
                </a>
              </li>
              <li>
                <a
                  href='/gift-cards'
                  className='text-sm text-gray-700 hover:text-pink-600 transition-colors block leading-relaxed'
                >
                  GIFT CARDS
                </a>
              </li>
              <li>
                <a
                  href='/new-arrivals'
                  className='text-sm text-gray-700 hover:text-pink-600 transition-colors block leading-relaxed'
                >
                  NEW ARRIVALS
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
