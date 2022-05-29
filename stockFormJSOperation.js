  function round (num, decimalPlaces = 0) {
    // 避免浮點預算的誤差，所以預先處理非整數的小數，第一參數為要處理的數字，第二參數為小數點的位數
    var m = Number((Math.abs(num) * (10**decimalPlaces)).toPrecision(15));
    return (Math.round(m) / (10**decimalPlaces) * Math.sign(num)).toFixed(decimalPlaces);
  }
  function amountFormula (id, row) {
    let stockTable = document.getElementById(id);
    let amount = round(Number(stockTable.tBodies[0].rows[row].cells[1].textContent) * Number(stockTable.tBodies[0].rows[row].cells[2].textContent), 0);
    return amount;
  }
  function feeFormula (id, row) {
    //手續費因為各家券商的優惠不同，在此統一設定為手續費打6折，低消為1元，小數點四捨五入至整數位。
    let stockTable = document.getElementById(id);
    let amount = Number(stockTable.tBodies[0].rows[row].cells[3].textContent);
    let feeRate = 0.001425*0.6;
    // ETF的證交稅從0.003降至0.001
    // 在table標籤中自訂data-isetf屬性(不能使用大寫，JS中用dataset.屬性來取用其值)，用以分辨證交稅率
    let taxRate = (stockTable.dataset.isetf) ? 0.001 : 0.003 ;
    let fee = 0;
    if (Math.sign(amount) == 1) {
      fee = amount * feeRate;
      return round(fee, 0) >= 1 ? round(fee, 0) : 1 ;
    } else if (Math.sign(amount) == -1) {
      fee = Math.abs(amount) * feeRate + Math.abs(amount) * taxRate;
      return round(fee, 0) >= 1 ? round(fee, 0) : 1 ;
    }
  }
  function costFormula (id, row) {
    let stockTable = document.getElementById(id);
    let totalCost = Number(stockTable.tBodies[0].rows[row].cells[3].textContent) + Number(stockTable.tBodies[0].rows[row].cells[4].textContent);
    let cost = round(totalCost/Math.abs(Number(stockTable.tBodies[0].rows[row].cells[1].textContent)), 2);
    return cost;
  }
  function sumFormula (id, col) {
    // 利用id找到要計算的表格，col用來設定column的位置，將tbody裡面的數字加總後回傳
    let stockTable = document.getElementById(id);
    let dataArray = [];
    Array.from(stockTable.tBodies[0].rows).forEach((row) => { dataArray.push(row.cells[col].textContent); });
    let sum = dataArray.reduce((a, b) => a + Number(b), 0);
    return (Number.isInteger(sum)) ? round(sum, 0) : round(sum, 2);
  }
  function avgFormula (id, col) {
    // 利用id找到要計算的表格，col用來設定column的位置，將tbody裡面的數字加總計算平均數後回傳
    let stockTable = document.getElementById(id);
    let dataArray = [];
    Array.from(stockTable.tBodies[0].rows).forEach((row) => { dataArray.push(row.cells[col].textContent); });
    let sum = dataArray.reduce((a, b) => a + Number(b), 0);
    let rows = stockTable.tBodies[0].rows.length;
    console.log(rows);
    let avg = sum / rows;
    return (Number.isInteger(avg)) ? round(avg, 0) : round(avg, 2);
  }
  function avgCostFormula (id, col) {
    // 利用前面計算過的總股數跟總成本，相除後輸入格子內
    let stockTable = document.getElementById(id);
    let totalStock = stockTable.tFoot.rows[0].cells[1].textContent
    let totalCost = Number(stockTable.tFoot.rows[0].cells[3].textContent) + Number(stockTable.tFoot.rows[0].cells[4].textContent);
    let avgCost = totalCost / totalStock;
    return (Number.isInteger(avgCost)) ? round(avgCost, 0) : round(avgCost, 2);
  }
  function avgCostXDFormula (id, col) {

  }
  function tbodyFormula (id) {
    let stockTable = document.getElementById(id);
    let rows = stockTable.tBodies[0].rows.length;
    let cols = stockTable.tBodies[0].rows[0].cells.length;
    let chooseFormulaArray = ["date", "stock", "price", "amount", "fee", "cost", "costXD"];
    // console.log(cols); //7 因為從0~6所以長度是7
    for (let row = 0 ; row < rows ; row++) {
      for (let col = 3 ; col < cols ; col++) {
        if(chooseFormulaArray[col] == "amount") {
          stockTable.tBodies[0].rows[row].cells[col].textContent = amountFormula(id, row);
        } else if (chooseFormulaArray[col] == "fee") {
          stockTable.tBodies[0].rows[row].cells[col].textContent = feeFormula (id, row);
        }else if (chooseFormulaArray[col] == "cost") {
          stockTable.tBodies[0].rows[row].cells[col].textContent = costFormula (id, row);
        } else if (chooseFormulaArray[col] == "none") {
          stockTable.tBodies[0].rows[row].cells[col].textContent = "";
        } else {
          stockTable.tBodies[0].rows[row].cells[col].textContent = "暫未處理"
        }
      }
    }
  }
  tbodyFormula('0050-台灣50');
  tbodyFormula('006208-富邦台50');
  function tfootFormula (id) {
    let stockTable = document.getElementById(id);
    let cols = stockTable.tBodies[0].rows[0].cells.length;
    let chooseFormulaArray = ["total", "sum", "none", "sum", "sum", "avgCost", "avgCostXD"];
    // console.log(cols); //7 因為從0~6所以長度是7
    for (let col = 1 ; col < cols ; col++) {
      if(chooseFormulaArray[col] == "sum") {
        stockTable.tFoot.rows[0].cells[col].textContent = sumFormula(id, col);
      } else if (chooseFormulaArray[col] == "avg") {
        stockTable.tFoot.rows[0].cells[col].textContent = avgFormula(id, col);
      } else if (chooseFormulaArray[col] == "none") {
        stockTable.tFoot.rows[0].cells[col].textContent = "";
      }else if (chooseFormulaArray[col] == "avgCost") {
        stockTable.tFoot.rows[0].cells[col].textContent = avgCostFormula (id, col);
      }else {
        stockTable.tFoot.rows[0].cells[col].textContent = "暫未處理"
      }
    }
  }
  tfootFormula ('0050-台灣50');
  tfootFormula ('006208-富邦台50');



  // console.log(kkk.querySelectorAll("table")[0].tHead.rows[0].cells[0].textContent);
  // console.log(kkk.querySelectorAll("table")[0].tBodies[0].rows[1].cells[0].textContent);
  // console.log(kkk.querySelectorAll("table")[0].tBodies[0].rows.length);
  // console.log(kkk.querySelectorAll("table")[0].tFoot.rows[0].cells[1].textContent);

  // document.creatElement
  // document.getElementById()
