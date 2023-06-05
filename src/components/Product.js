import React, { useEffect, useState } from "react";
import Rating from "./Rating";
import close from "../assets/close.svg";
import { Signer, ethers } from "ethers";
export default function Product({
  item,
  provider,
  account,
  dappazon,
  togglePop,
}) {
  const [order, setOrder] = useState(null);
  const [hasBought, setHasBought] = useState(false);
  const fetchDetails = async () => {
    const events = await dappazon.queryFilter("Buy");
    const orders = events.filter(
      (event) =>
        event.args.buyer === account &&
        event.args.itemId.toString() === item.id.toString()
    );
    if (orders.length === 0) return;
    const order = await dappazon.orders(account, orders[0].args.orderId);
    setOrder(order);
  };
  const buyHandler = async () => {
    const signer = await provider.getSigner();
    let transaction = await dappazon
      .connect(signer)
      .buy(item.id, { value: item.cost });
    await transaction.wait(1);
    setHasBought(true);
  };
  useEffect(() => {
    fetchDetails();
  }, [hasBought]);
  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt="product" />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>
          <Rating value={item.rating} />
          <hr />
          <p>{item.address}</p>
          <h2>{ethers.utils.formatUnits(item.cost.toString(), "ether")}ETH</h2>
          <hr />
          <h2>Overview</h2>
          <p>
            {item.description}
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex debitis
            aut accusantium minima eveniet dolorem, impedit expedita consequatur
            nobis obcaecati. Voluptate blanditiis earum expedita amet impedit,
            id magnam facere neque!
          </p>
        </div>
        <div className="product__order">
          <h1>{ethers.utils.formatUnits(item.cost.toString(), "ether")}ETH</h1>
          <p>
            FREE delivery <br />
            <strong>
              {new Date(Date.now() + 225600000).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </strong>
          </p>
          {item.stock > 0 ? <p>In Stock.</p> : <p>Out of Stock.</p>}
          <button className="product__buy" onClick={buyHandler}>
            Buy Now
          </button>
          <p>
            <small>Ships from </small>Dappazon
          </p>
          <p>
            <small>Sold by </small>Dappazon
          </p>
          {order && (
            <div className="product__bought">
              Itme bought on <br />
              <strong>
                {new Date(
                  Number(order.time.toString() + "000")
                ).toLocaleDateString(undefined, {
                  weekday: "long",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </strong>
            </div>
          )}
        </div>
        <button className="product__close" onClick={togglePop}>
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
}
