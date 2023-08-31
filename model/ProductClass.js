const fs = require("fs");
const path = require("path");

class Product {
  async getAll() {
    return fs.promises
      .readFile(path.join(__dirname, "..", "data", "data.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        return {
          flag: true,
          data: data,
        };
      })
      .catch((error) => {
        console.log(error);
        return {
          flag: false,
        };
      });
  }
  async getById(id) {
    return fs.promises
      .readFile(path.join(__dirname, "..", "data", "data.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        const parsedData = JSON.parse(data);
        const filtered = parsedData.filter((item) => item.id === id)[0];
        return {
          flag: true,
          data: filtered,
        };
      })
      .catch((error) => {
        console.log(error);
        return {
          flag: false,
        };
      });
  }

  async deleteById(id) {
    return fs.promises
      .readFile(path.join(__dirname, "..", "data", "data.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        const parsedData = JSON.parse(data);
        const filtered = parsedData.filter((item) => item.id !== id);
        const idfound = parsedData.filter((item) => item.id === id);
        return fs.promises
          .writeFile(
            path.join(__dirname, "..", "data", "data.json"),
            JSON.stringify(filtered)
          )
          .then(() => {
            if (idfound[0].id) {
              return {
                flag: true,
                data: idfound[0]
              };
            } else {
              return {
                flag: false,
              };
            }
          })
          .catch(() => {
            return {
              flag: false,
            };
          });
      })
      .catch((error) => {
        console.log(error);
        return {
          flag: false,
        };
      });
  }

  async add(product) {
      return fs.promises
        .readFile(path.join(__dirname, "..", "data", "data.json"), {
          encoding: "utf-8",
        })
        .then((data) => {
          const allProduct = JSON.parse(data);
          const myproduct = {
            ...product,
            id: allProduct[allProduct.length - 1].id + 1,
          };
          allProduct.push(myproduct);
          return fs.promises
            .writeFile(
              path.join(__dirname, "..", "data", "data.json"),
              JSON.stringify(allProduct)
            )
            .then(() => {
              return {
                flag: true,
                data: myproduct,
              };
            })
            .catch(() => {
              return {
                flag: true,
              };
            });
        })
        .catch((error) => {
          console.log(error);
          return {
            flag: false,
          };
        });
  }
  async update(id, product) {
    try {
      const error = [];
      if (product.id || product.id === "") {
        error.push("ID can not be updated");
      }
      if (product.name === "") {
        error.push("Name Can not be empty");
      }
      if (product.price !== 0 && product.price === "") {
        error.push("Price Can not be empty");
      } else {
        if (product.price <= 0) {
          error.push("Price must be positive and not 0");
        }
      }
      if (product.author === "") {
        error.push("author Can not be empty");
      }
      if (product.stock !== 0 && product.stock === "") {
        error.push("stock Can not be empty");
      } else {
        if (product.stock < 0) {
          error.push("stock must be positive and not 0");
        }
      }
      if (error.length > 0) {
        return {
          flag: false,
          error: error,
        };
      } else {
        return fs.promises
          .readFile(path.join(__dirname, "..", "data", "data.json"), {
            encoding: "utf-8",
          })
          .then((data) => {
            const allProduct = JSON.parse(data);
            const extProduct = allProduct.filter((item) => item.id === id);
            const index = allProduct.indexOf(extProduct[0]);
            if (index == -1) {
              return {
                flag: false,
                error: { message: "ID not found" }
              };
            } else {
              const myproduct = { ...extProduct[0], ...product };
              allProduct[index] = myproduct;
              return fs.promises
                .writeFile(
                  path.join(__dirname, "..", "data", "data.json"),
                  JSON.stringify(allProduct)
                )
                .then(() => {
                  return {
                    flag: true,
                    data: myproduct,
                  };
                })
                .catch(() => {
                  return {
                    flag: false,
                  };
                });
            }
          })
          .catch((error) => {
            return {
              flag: false,
            };
          });
      }
    } catch (error) {
      return {
        flag: false,
      };
    }
  }

  async restoreProduct(product) {
    try {
      console.log(product);
      delete product.id;
      const restored = await this.add(product);

      if (restored.flag) {
        return {
          flag: true,
          data: restored.data
        }
      } else {
        return {
          flag: false
        }
      }
    } catch (error) {
      return {
        flag: false
      }
    }
  }
}
module.exports = new Product();
