import React, { useState } from "react";
import "../Style/LoginRegister.css";
import logo from '../Icons/logo.png';

const StockTicker = () => {

    const stocks = [
        { name: "Apple",
          symbol: "AAPL",
          stockimg: "../Icons/apple.png",
          price: 164.90
        },
        { name: "Microsoft",
          symbol: "MSFT",
          stockimg: "../Icons/microsoft.png",
          price: 288.30
        },
        { name: "Amazon",
          symbol: "AMZN",
          stockimg: "../Icons/amazon.png",
          price: 103.29
        },
        { name: "NVIDIA",
          symbol: "NVDA",
          stockimg: '../Icons/nvidia.png',
          price: 277.77
        },
        { name: "Tesla",
          symbol: "TSLA",
          stockimg: '../Icons/tesla.png',
          price: 162.55,
        },
        { name: "AT&T Inc.",
          symbol: "T",
          stockimg: '../Icons/at&t.png',
          price: 17.53,
        },
        { name: "Intel",
          symbol: "INTC",
          stockimg: '../Icons/intel.png',
          price: 29.66,
        },
        { name: "Getty",
          symbol: "GETY",
          stockimg: '../Icons/getty.png',
          price: 6.63,
        },
        { name: "Alibaba Group",
          symbol: "BABA",
          stockimg: '../Icons/alibaba.png',
          price: 86.89,
        },
        { name: "Bank of America",
          symbol: "BAC",
          stockimg: '../Icons/bac.png',
          price: 29.76,
        },
        { name: "KeyCorp",
          symbol: "KEY",
          stockimg: '../Icons/keycorp.png',
          price: 11.13,
        },
        { name: "AMC Entertainment",
          symbol: "AMC",
          stockimg: '../Icons/amc.png',
          price: 4.96,
        },
        { name: "Vale S.A.",
          symbol: "VALE",
          stockimg: '../Icons/vale.png',
          price: 14.14,
        },
        { name: "NIO Inc.",
          symbol: "NIO",
          stockimg: '../Icons/nio.png',
          price: 8.29,
        },
        { name: "Ford",
          symbol: "F",
          stockimg: '../Icons/ford.png',
          price: 12.16,
        },
        { name: "Alphabet Inc.",
          symbol: "GOOGL",
          stockimg: '../Icons/alphabet.png',
          price: 105.97,
        },
        { name: "Ambev S.A.",
          symbol: "ABEV",
          stockimg: '../Icons/ambev.png',
          price: 2.82,
        },
        { name: "Nokia",
          symbol: "NOK",
          stockimg: '../Icons/nokia.png',
          price: 4.20,
        },
        { name: "Fox Corporation",
          symbol: "FOX",
          stockimg: '../Icons/fox.png',
          price: 29.91,
        },
        { name: "Zoom Inc.",
          symbol: "ZM",
          stockimg: '../Icons/zoom.png',
          price: 65.80,
      },
      
    ]

    return(

        <div className="Ticker">
        
            <div class="hwrap">
                <div class="hmove">
                {stocks.map((stock,i) => (
                        <div key={i} className="hitem"> {stock.name} ${stock.price}</div>

                        ))}
                </div>
            </div>
        </div>
    )
}


export default StockTicker;