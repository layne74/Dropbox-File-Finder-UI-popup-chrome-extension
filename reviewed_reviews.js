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
 * Takes in the HTML STRING of reviewer details, score and the br.
 * If the score is less than or equal to 2, the resubmission pill is appended to the score heading
 * Else string will be returned if with nothing added if the score is greater than 2
 * @param {string} str - The HTML content to parse
 * @returns {string} - The modified HTML content with a resubmission pill
 */
  function addPill(str) {
    // Parse the HTML string into a DOM object and 
    // Grab the body to get rid of the HTML tags
    const parser = new DOMParser();
    const body = parser.parseFromString(str, 'text/html').body;

    // Selects the h5 that houses the "<b>Score</b>"
    let scoreHeading = body.querySelector('h5');
    scoreHeading.style.width = "100%";
    scoreHeading.style.display = "flex";
    scoreHeading.style.justifyContent = "space-between";
    // Grabs the score from "Completeness: 2/4"
    let score = Number(body.querySelector('h6').innerText.slice(14, 15));
 
  /**
   * Creates a pill element with the given text and class
   * @param {string} txt - The text to display in the pill
   * @param {boolean} pass - Whether the pill should be a pass or resubmission pill
   * @returns {Element} - The pill element
   */
    function createPill(txt, pass) {
      let resubmissionPill = document.createElement("span");
      resubmissionPill.className = "DBXFF-pill";
      resubmissionPill.classList.add(pass ? "DBXFF-pass" : "DBXFF-resub");
      resubmissionPill.innerHTML = txt;
      return resubmissionPill;
    }

    // Appends the resubmission pill to the score heading
    // If the score is less than or equal to 2
    if (score <= 2) {
      scoreHeading.appendChild(createPill("Resub", false));
      console.log(score)
    } else {
      scoreHeading.appendChild(createPill("Pass", true));
    }

    return body.innerHTML;
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
        if (index == 1) {
          return addPill("<p>" + paragraph);
        }
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
