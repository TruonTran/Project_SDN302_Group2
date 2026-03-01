import React from "react";
import { Carousel } from "react-bootstrap";

// dùng chung cho cả home page và product page, truyền vào 1 mảng chứa url ảnh để hiển thị
const CarouselShare = ({ carousels }) => {
  return (
    <Carousel className="mt-2">
      {carousels.map((item) => (
        <Carousel.Item key={item.id}>
          <img
            className="d-block w-100"
            src={item.url}
            style={{ height: 600 }}
            alt={item.id}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselShare;
