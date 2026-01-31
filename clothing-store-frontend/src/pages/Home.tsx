import React from "react";
import ProductList from "../components/ProductList/ProductList";

interface HomeProps {
  userId?: number;
}

const Home: React.FC<HomeProps> = ({ userId }) => {
  return (
    <div>
      <h1>Каталог товаров</h1>
      <ProductList userId={userId} />
    </div>
  );
};

export default Home;
