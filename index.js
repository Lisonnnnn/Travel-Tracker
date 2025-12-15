import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db=new pg.Client(
  {
    user:"postgres",
  host:"localhost",
  database:"world",
  password:"1435840",
  port:5432,

  }


);
db.connect();
async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");

  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}


app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  res.render("index.ejs", { countries: countries, total: countries.length });
});

app.post("/add",async(req,res)=>{

  const country_name=req.body["country"].toUpperCase();
  console.log(country_name);
  const result=(await db.query("select country_code from countries where UPPER(country_name)=$1",[country_name])).rows;
  console.log("country find: ",result);
  
 
 if(result.length!=0){
  console.log(result[0].country_code)
  await db.query("Insert into visited_countries (country_code) values ($1)  ON CONFLICT DO NOTHING",[result[0].country_code]);
 }
  res.redirect("/");
  

})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
