const express = require("express");
const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart")
const router = express.Router();

router.get("/goods/cart", async (req, res) => {
  const carts = await Cart.find();
  const goodsIds = carts.map((cart) => cart.goodsId)

  const goods = await Goods.find({ goodsId: goodsIds})


  res.json({
      cart : carts.map((cart) => {
          return {
              quantity: cart.quantity,
              goods: goods.find((item) => item.goodsId === cart.goodsId)
          };
      })
  })
})



router.get("/", (req, res) => {
  res.send("this is root page");
});

//상품목록 
router.get("/goods", async (req, res) => {  //쿼리함수예시 /goods?category=drink
  const { category } = req.query;

  const goods = await Goods.find({ category });

  res.json({
    goods,
  })
})

//상세조회 한개
router.get("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params; //goodsId = req.params.goodsId;

  const [goods] = await Goods.find({ goodsId: Number(goodsId) })


  res.json({
    goods
  })
})


//장바구니 상품 등록
// router.post("/goods/:goodsId/cart", async (req, res) =>{
//   const { goodsId } = req.params;
//   const { quantity } = req.body;

//   const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
//   if (existsCarts.length){
//     return res.status(400).json({ success: false, errorMessage: "이미 장바구니에 들어있는 상품입니다."})
//   }

//   await Cart.create({ goodsId: Number(goodsId), quantity})
//   res.json({ success: true})
// })


//장바구니 상품 삭제
router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  
  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length){
    await Cart.deleteOne({ goodsId: Number(goodsId)})
  }
  res.json({ success: true })
})

//장바구니 수량 수정
router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  // if (quantity < 1){
  //   return res.status(400).json({
  //    errorMessage: "1 이상의 값만 입력할 수 있습니다.",
  //   })
    
  // }

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (!existsCarts.length){
    await Cart.create({ goodsId: Number(goodsId), quantity})
  }else{
    await Cart.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } });
  }
  res.json({ success: true })
})

  



router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." })
  }
  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });
  res.json({ goods: createdGoods });
});

module.exports = router; // 다른곳에 가져갈려면 모듈로써 지정해줘야됨 
                         //module.exports = "함수이름"