const request = require("request-promise");
const cheerio = require("cheerio");

const scrapedJobHeaders = async () => {
  try {
    const scrapedSample = {
      title: "DevOps Engineer",
      description:
        "Signup on Hired to find your dream job as a DevOps Engineer/Site Reliability Engineerat one of 10,000+ companies looking for candidates just like you.",
      dataPosted: new Date("2018-07-13"),
      url: "https://sfbay.craigslist.org/sfc/sof/d/san-francisco-devops-engineer/7396014480.html",
      hood: "city of san francisco",
      compensation: "23/hr",
    };

    const ScrapedResult = [];
    const html = await request.get(
      "https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof"
    );
    // console.log(html);
    const $ = await cheerio.load(html);
    // $(".result-info").each((index,element)=>{
    //     console.log($(element).find(".result-title").text())
    // })
    // const title = $(".result-info").each((index, element) => {
    //   $(element).find(".result-title").text();
    // });
    // const url = $(".result-info").each((index, element) => {
    //     $(element).find(".result-title").attr("href");
    // });
    // const scrapedRows = {title, url};
    // ScrapedResult.push(scrapedRows);
    
    // console.log(ScrapedResult);

    const resultTitle = $(".result-info").each((index,element)=>{
        const title = $(element).find(".result-title").text()
        const url = $(element).find(".result-title").attr("href");
        const date = new Date ($(element).find(".result-date").attr("datetime"));
        const neighbourHood = $(element).find(".result-hood").text()
        const scrapedFields = {title, url, date, neighbourHood};
        ScrapedResult.push(scrapedFields)
    })
    // console.log(ScrapedResult)
    return ScrapedResult;

  } catch (error) {
    console.log("Error in main try block");
  }
};

const scrapedDescription = async (jobWithHeaders)=>{
    return await Promise.all(
        jobWithHeaders.map(async job =>{
            const htmlResult = await request.get(job.url);
            const $= await cheerio.load(htmlResult);
            $(".print-qrcode-container").remove();
            job.description= $("#postingbody").text();
            return job

        })
    )
}

const scrapeCraigslist= async()=>{
    const jobWithHeaders = await scrapedJobHeaders();
    const jobsFullData = await scrapedDescription(jobWithHeaders)
    console.log(jobsFullData)

}
scrapeCraigslist();
