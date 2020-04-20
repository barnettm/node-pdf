const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

async function createPDF(data){

	var templateHtml = fs.readFileSync(path.join(process.cwd(), 'templates/config.html'), 'utf8');
	var template = handlebars.compile(templateHtml);
	var html = template(data);

	var milis = new Date();
	milis = milis.getTime();

  var pdfPath = path.join('pdf', `${data.customer}.pdf`);

	var options = {
		// width: '1230px',
		// headerTemplate: "<p></p>",
		// footerTemplate: "<p></p>",
		displayHeaderFooter: false,
		format: 'Letter',
		// margin: {
		// 	top: "10px",
		// 	bottom: "30px"
		// },
		printBackground: true,
		path: pdfPath
	}

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: true
	});

	var page = await browser.newPage();

	
	await page.setContent(html, {
		waitUntil: 'networkidle0'
	});

	await page.pdf(options);
	await browser.close();
}

const data = {
	customer: "Matt (Test Customer) Barnett",
	date: "04/22/2021",
	user: "Matt Barnett",
	total: '16,110',
	primaryItem: "Label: 3oz Glass Jar Clear Poly Half Wrap 1.375 x 3.5 RCR Varnish",
	primaryItemCost: "14.75",
	quantity: "4000",
	componentItem: "Flush V2 Jar CR Lid : Universal Lid (48/400) : Black : 108ct",
	componentItemCost: "2.75",
	decorations: [{
		name: "Silkscreen Print: 2-color",
		cost: "1.77"
	}, {
		name: "Foil Stamp",
		cost: "1.77"
	}]
}

createPDF(data);