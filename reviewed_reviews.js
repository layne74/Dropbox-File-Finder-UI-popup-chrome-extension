// Reverts all the mentor review text to if original format

// 1. Identify the <p> tags
// 2. Iterate over the retrieved <p> elements
// 2.1. Create a new <pre> element
// 2.2. Set the innerHTML of the <pre> element to the innerHTML of the <p> element
// 2.3. Replace the <p> element with the <pre> element
// 3. Use the 'replaceWith' method to replace the <p> element with the <pre> element

if (window.location.pathname.includes("/student/reviews/")) {
  let paragraphs = document.querySelectorAll("p");

  // Loop through the <p> elements
  function preVert() {
    for (let i = 0; i < paragraphs.length; i++) {
      if (
        (paragraphs[i]?.tagName === "P" &&
          paragraphs[i]?.nextElementSibling?.tagName === "P") ||
        (paragraphs[i]?.tagName === "P" &&
          paragraphs[i]?.previousElementSibling?.tagName === "PRE")
      ) {
        const preElement = document.createElement("pre");
        preElement.className = "DBXFF-review-text";
        preElement.innerHTML = paragraphs[i].innerHTML.trim();
        paragraphs[i].replaceWith(preElement);
        //paragraphs[i].nextElementSibling.tagName === "P" || paragraphs[i].previousElementSibling.tagName === "P"
      }
    }
    //contained()
  }

/**
 * Clean up previous reviews by cleaning the reviews allowing HTML tags
 * to be displayed and also reformatting the review blocks into <pre> elements.
 */
  function cleanPreviousReviews() {
    let body = document.querySelector("body > div > div").innerHTML;
    let splitBody = body.split("<h4>");

    // Map over each review
    let output = splitBody.map((section) => {

      /*
        Splits like this
        0 - Task Name, Course
        1 - P that houses mentor name, Date submitted and date completed
        2 < - Review blocks 
      */
      let parts = section.split("<p>");
      
      parts = parts.map((paragraph, index) => {
        // Adds the opening P tag that is removed from split to Reviewer, submitted and completed
        if (index == 1) return "<p>" + paragraph;
        // Skips details and score
        if (index < 2) return paragraph;

        // Due to split on <p> tags,the closing tag needs to be removed
        // Removing everything that comes after it as well.
        let afterClosingTag = paragraph.lastIndexOf("</p>");
        let end = ""; 
        // If there is a closing tag
        if (afterClosingTag !== -1) {
          // Get everything that comes after the closing tag - this captures the <hr> dividers and 
          // script tag at the end of the page
          end = paragraph.slice(afterClosingTag + 4).trim();
          paragraph = paragraph.slice(0, afterClosingTag);
          // If there is no closing tag, it is assumed that a <p> tag is present in the review.
          // The current part is skipped but added to the next part including the <p> tag that 
          // is missing due to the split
        } else {
          parts[index + 1] = parts[index] + "<p>" + parts[index + 1];
          return;
        }

        // Houses the review part (positive, improvements, overall) and any residual HTML
        const divElement = document.createElement("div");
        // Create a new <pre> element for the actual text
        const preElement = document.createElement("pre");

        preElement.className = "DBXFF-review-text"; // Class for styling
        preElement.textContent = paragraph.trim();  
        divElement.appendChild(preElement);
        divElement.innerHTML += end; // Add any residual HTML
        return divElement.outerHTML;
      });

      return parts.join("");
    });

    let newHTML = output.join("<h4>");

    document.querySelector("body > div > div").innerHTML = newHTML;
    
  }

  // preVert()
  cleanPreviousReviews()
}
