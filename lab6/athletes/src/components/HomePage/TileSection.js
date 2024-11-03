import React, { useState } from 'react';
import Tile from './Tile';
import tileImage1 from '../../images/1.jpg';
import tileImage2 from '../../images/2.jpg';
import tileImage3 from '../../images/3.jpg';
import tileImage4 from '../../images/4.jpg';
import ViewMoreButton from './ViewMoreButton';

const TileSection = () => {
  // Состояние для контроля отображения дополнительных элементов
  const [showMore, setShowMore] = useState(false);

  // Функция для переключения состояния
  const handleViewMore = () => {
    setShowMore(!showMore);
  };

  return (
      <section className="section_tiles">
          <div className="tiles">
              <Tile
                  image={tileImage1}
                  altText="Tile 1"
                  title="asics"
                  description="найкращі кросси у житті"
              />
              <Tile
                  image={tileImage2}
                  altText="Tile 2"
                  title="new balance"
                  description="ну таке, я б не купила"
              />
              <Tile
                  image={tileImage3}
                  altText="Tile 3"
                  title="hoka"
                  description="ван лаф у моєму житті"
              />
              {/* Отображение дополнительных элементов при нажатии на кнопку */}
          {showMore && (
            <div>
              <Tile
                  image={tileImage4}
                  altText="Tile 3"
                  title="saucony"
                  description="какашка, яка подобається Єгору"
              />
            </div>
          )}
          </div>




          {/* Кнопка для показа дополнительных элементов */}
          <ViewMoreButton onClick={handleViewMore} />
      </section>
  );
};

export default TileSection;
