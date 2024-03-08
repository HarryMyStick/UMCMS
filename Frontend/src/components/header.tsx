import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
      <div className="px-8 lg:px-12">
        <p className="text-dark mb-2 mt-1 block w-full text-sm md:text-base">
          Tagline
        </p>
        <h1 className="mt-9 text-3xl font-semibold text-dark md:text-4xl">
          Contribute <span className="bg-darkBlue">articles</span>
        </h1>
        <div className="mt-12 lg:flex lg:justify-start">
          <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis
            commodi cum cupiditate ducimus, fugit harum id necessitatibus odio
            quam quasi, quibusdam rem tempora voluptates. Cumque debitis
            dignissimos id quam vel!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
