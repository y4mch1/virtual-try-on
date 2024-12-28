import Head from 'next/head';
import './index.css';

export default function Home() {
  return (
    <>   
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="/dist/output.css" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300&family=Source+Sans+Pro:wght@400&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" />
        <link rel="stylesheet" href="virtual-try-on/src/app/index.css" />
        <title>Test</title>
      </Head>

      <div className="moving">
        <h1 className="name">Virtual Image Try On.</h1>
        <p className="subtitle">Generate Your Own Clothes</p>
      </div>

      <div id="more" className="fde py-20 px-20">
        <div className="py-24 flex flex-col md:flex-row">
          <div className="md:w-1/2 flex justify-center">
            <img src="/image1.png" alt="First image" className="object-contain" />
          </div>
          <div className="md:w-1/2 px-8 py-7">
            <h1 className="text-2xl font-medium">Lorem Ipsum</h1>
            <p className="pde break-words text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a venenatis massa. Nulla nec vehicula nisl.
              Suspendisse eu imperdiet nulla.
            </p>
          </div>
        </div>

        <div className="py-24 flex flex-col md:flex-row-reverse">
          <div className="md:w-1/2 flex justify-center">
            <img src="/image1.png" alt="Second image" className="object-contain" />
          </div>
          <div className="md:w-1/2 px-8 py-7">
            <h1 className="text-2xl font-medium">Lorem Ipsum</h1>
            <p className="pde break-words text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a venenatis massa. Nulla nec vehicula nisl.
              Suspendisse eu imperdiet nulla.
            </p>
          </div>
        </div>

        <div className="py-24 flex flex-col md:flex-row">
          <div className="md:w-1/2 flex justify-center">
            <img src="/image1.png" alt="Third image" className="object-contain" />
          </div>
          <div className="md:w-1/2 px-8 py-7">
            <h1 className="text-2xl font-medium">Lorem Ipsum</h1>
            <p className="pde break-words text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a venenatis massa. Nulla nec vehicula nisl.
              Suspendisse eu imperdiet nulla.
            </p>
          </div>
        </div>
      </div>

      <div className="-mt-20 flex justify-center">
        <img src="/mouse.svg" alt="Mouse icon" className="-mt-10 w-10 animate-bounce" />
      </div>

      <a className="-mt-10 opacity-70" href="upload">
        Discover
      </a>
    </>
  );
}
