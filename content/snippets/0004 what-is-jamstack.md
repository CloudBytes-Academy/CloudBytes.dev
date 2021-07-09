Title: What is Jamstack and why should you be using it?
Date: 2021-07-08
Category: Snippets
Tags: python, javascript, pelican
Author: Rehan Haider
Summary: An introduction to Jamstack concepts and why should you be using it instead of wordpress.
Keywords: Jamstack, hugo, functions, serverless, netlify, firebase, pelican, 11ty, eleventy, jekyll, github, static website

Jamstack is a serverless web-app design concept which derives its JAM from JavaScript, API, and Markup. Even though it contains the work "-stack" it's not a framework instead it specifies a architecture pattern for designing websites that does not require a server at the backend resulting in massive performance improvements and lower cost. 

This architectural pattern can be implemented by a combination of technologies for each one of JavaScript, API, and Markup. 

<img src="{static}/images/s0004/JAM.png" alt="jamstack architecture" width="75%" caption="Fig. 1: Jamstack frameworks / tools combination">

## So what makes a Jamstack?

This is achieved by 

1. **Markup / Frontend**: Uses a static website generator (SSG)  such as [Pelican](https://docs.getpelican.com/en/latest/), [Hugo](https://gohugo.io/), [Gatsby](https://www.gatsbyjs.com/), or [Next.js](https://nextjs.org/), etc. to convert a frontend template designed using [Angular](https://angular.io/), [Svelte](https://svelte.dev/), [Jinja2](https://jinja.palletsprojects.com/en/3.0.x/), or other templating languages into simple static HTML which can be served by using static website hosting such as [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html), [Netlify](https://www.netlify.com/), or [Firebase](firebase.google.com/), etc, eliminating the need for server based hosting which is considerably more expensive. 
2. **API / Backend **: Instead of using a server for processing business logic, e.g. authentication, Jamstack specifies using APIs such as that provided by Firebase, [Okta](https://www.okta.com/), etc. to handle user management. Similarly, more complex business logic that be coded in any language of one's choice using [AWS Lambda](https://aws.amazon.com/lambda/), [Google Cloud Functions](https://cloud.google.com/functions), etc. and used as as API by the frontend using, wait for it, 
3. **JavaScript / Event Handling**: JavaScript is used to handle user interaction and trigger events accordingly. Similarly, when an API response is received, JavaScript is used to render the output to the users and make the website dynamic. 

Alternatively, there are headless CMS such as Ghost, Strapi, etc. that can do a combination of above together. 

## What makes Jamstack different?

One can argue there is nothing new in "Jamstack", and older technology stacks used to function in the early days where every page was static and there was no server side rendering. 

As websites became more complex and technology matured we saw solutions like WordPress, Joomla, etc. coming into picture which would remove many repetitive tasks and function as a full Content Management System (CMS). 

But as these solutions become more powerful, it's compute requirements increased as well. A typical blog with reasonable audience running on WordPress would require 2 vCPU and 1 GB RAM minimum, which will cost between $5 - $10. Although not a big number, the correlation of cost to the scalability will largely be linear due to the server side rendering requirements. 

Compare that with a blog built using Jamstack architecture, the blog can run on the free GitHub pages upto more than 5,000 concurrent users before even considering more serious alternatives. 

Additionally, because of the lack of moving parts, testing becomes a lot easier and along with that building a CI/CD pipeline too. 

Finally, because you're using a bunch of static pages, you can use Content Delivery Network such as CloudFlare, AWS CloudFront, etc. to deliver your pages from close to where the users are resulting in sub-second page load times. 

<img src="{static}/images/s0004/cdn.png" alt="jamstack content delivery network" width="75%" caption="Fig. 2: Jamstack frameworks content delivery network">

## When to use Jamstack? 

Theoretically, you can build almost anything using Jamstack architecture by utilising services such as [Firebase](https://firebase.google.com/), [AWS Amplify](https://aws.amazon.com/amplify/), [Supabase](https://supabase.io/), etc. 

E.g., you can replace a WordPress blog completely with Jamstack and still get 100 Rating on [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) without breaking a sweat, since, the webpages are generated ahead of time, there is 0 lag due to server side rendering (SSR). 

<img src="{static}/images/s0004/pagespeed.png" alt="uberpython pagespeed results" caption="Fig. 3: uberpython pagespeed results">

Static Site Generators (SSGs) Such as Hugo, [Pelican](https://docs.getpelican.com/en/latest/), [Gatsby](https://www.gatsbyjs.com/), [11ty](https://www.11ty.dev/), etc. provide a rich plugin and theme ecosystem which can get your started with less technical knowledge than what is required for implementing WordPress. 

But that is not all, more complex use cases such as websites that offer courses, or other SaaS services can also be implemented easily. 

## Which combination to choose?

That depends on several factors and one usually ends up doing some trial and error before finalising on one. But you can follow some guidelines below that we used to arrive at the stack for [UberPython](https://uberpython.com/).

* **Speed**: If your website has thousands of pages, use Hugo which is written in Go and designed to be really fast but has a steep learning curve. 
* **Familiar with React**: Use [Next.js](https://nextjs.org/) is a full React based framework that comes with kitchen sink. The alternative is [Gatsby](https://www.gatsbyjs.com/) which is equally popular and is a lot more customisable. 
* **Familiar with Ruby**: [Jekyll](https://jekyllrb.com/) is that you should be using. It is a fantastic SSG that is used by GitHub to serve static Github.io pages. 
* **Familiar with Python**: [Pelican](https://blog.getpelican.com/) and [Nikola](http://www.getnikola.com/) are the frontrunners that are based on Python
* **Familiar with JavaScript**: Most of the options above are based on JavaScript frameworks, but if you want a bit more freedom, [Eleventy](https://11ty.dev/) is your best choice with excellent templating support for almost any language (Nunjucks, Haml, Pug, Liquid, etc.) and plugin ecosystem.
* **Designed for Blog**: [Hexo](https://hexo.io/), [Jekyll](https://jekyllrb.com/), and [Pelican](https://blog.getpelican.com/) are best suited for use as blogging platform for it's support of Markdown and Liquid tags and flexibility. 
* **Documentation**: [MkDocs](http://www.mkdocs.org/) and [Docsify](https://docsify.js.org/) are best suited for documentation websites 

All of the options above are excellent in themselves with pros and cons in choosing one. 

This can be then combined with APIs for other functions such as authentication, email, messaging, queuing, payments, etc. 



