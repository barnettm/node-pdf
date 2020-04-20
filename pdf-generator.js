const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

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

async function createPDF(data){
	let templateHtml = fs.readFileSync(path.join(process.cwd(), 'templates/config.html'), 'utf8');
	let template = handlebars.compile(templateHtml);
	const html = template(data);
  const pdfPath = path.join('pdf', `${data.customer}.pdf`);

	const options = {
		displayHeaderFooter: false,
		format: 'Letter',
		printBackground: true,
		path: pdfPath
	}

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: true
	});

	let page = await browser.newPage();
	await page.setContent(html, {
		waitUntil: 'networkidle0'
	});

	await page.pdf(options);
	await browser.close();
}



createPDF(data);