/* 
GET DATA https://world.openfoodfacts.org/data
SAMPLE JSON https://world.openfoodfacts.org/api/v0/product/737628064502.json
SOURCE JSON https://world.openfoodfacts.org/api/v0/product/[barcode].json
TEST getFetch('011110038364') or 041196910759
*/

document.querySelector('button').addEventListener('click', getFetch)
//FETCH!
function getFetch(){
    let inputVal = (document.getElementById("barcode").value).padStart(12, '0')
  
    const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`
  
    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {    // use JSON data
            console.log(data)
            if (data.status === 1) {
                const item = new ProductInfo(data.product)
                item.showInfo()
                item.listingIngredients()
            } else if (data.status === 0) {
                alert(`Product ${inputVal} not found. Please try another item number.`)
            }
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

// CONSTRUCTION!
class ProductInfo {
    constructor(productData) {  // Passing in data.product
        this.name = productData.product_name
        this.ingredients = productData.ingredients
  
        this.image = productData.image_url
    }
   
    showInfo() {
        document.getElementById('prodImg').src = this.image
        document.getElementById('prodName').innerText = this.name
    }
    listingIngredients() {
        let tableRef = document.getElementById('ingredientTable')   //Target Table
        // Clear the ingredients table
        for (let i = 1; i<tableRef.rows.length; i++) {
            tableRef.deleteRow(i)
        }

        if (!(this.ingredients == null)) {
            // Loop through ingredients array
            for (let key in this.ingredients) {  // key is property name
                let newRow = tableRef.insertRow(-1)  // Create new row
                // Create new cells
                let newICell = newRow.insertCell(0)
                let newVCell = newRow.insertCell(1)
                // Insert text
                let newIText = document.createTextNode(  // set to ingredients
                    this.ingredients[key].text  // Inside of each ingredient array, want the text element
                )
               
                let vegStatus = !(this.ingredients[key].vegetarian) ? 'unknown' : this.ingredients[key].vegetarian
                
                let newVText = document.createTextNode(vegStatus)
                
                newICell.appendChild(newIText)
                newVCell.appendChild(newVText)
                if (vegStatus === 'no') {
            
                    newVCell.classList.add('nonVegItem')
                } else if (vegStatus === 'unknown' || vegStatus === 'maybe') {
                 
                    newVCell.classList.add('unknownMaybeItem')
                }
            }
        }
    }
}


//   TEST getFetch('011110038364') or 041196910759