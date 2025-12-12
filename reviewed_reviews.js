// Reverts all the mentor review text to if original format

// 1. Identify the <p> tags
// 2. Iterate over the retrieved <p> elements
// 2.1. Create a new <pre> element
// 2.2. Set the innerHTML of the <pre> element to the innerHTML of the <p> element
// 2.3. Replace the <p> element with the <pre> element
// 3. Use the 'replaceWith' method to replace the <p> element with the <pre> element

//! -----------------------------DO NOT TOUCH.---------------------------------------------💀
// DO NOT TOUCH. THESE ARE TEMPLATES BEING LOOKED FOR IN THE REVIEWS
// IF YOU TOUCH THEM YOU WILL BREAK THE LAYOUT OF THE REVIEWS
const KEYFORHR = `</p>
        
    
        <hr>
        <hr>
        <hr>`;
// DO NOT TOUCH. THESE ARE TEMPLATES BEING LOOKED FOR IN THE REVIEWS
// IF YOU TOUCH THEM YOU WILL BREAK THE LAYOUT OF THE REVIEWS
const KEYFOREXTRA = `</p>
        
    
        
    </div>`;
//! -----------------------------DO NOT TOUCH.--------------------------------------------💀

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
    const body = parser.parseFromString(str, "text/html").body;

    // Selects the h5 that houses the "<b>Score</b>"
    let scoreHeading = body.querySelector("h5");
    scoreHeading.style.width = "100%";
    scoreHeading.style.display = "flex";
    scoreHeading.style.justifyContent = "space-between";
    // Grabs the score from "Completeness: 2/4"
    let score = Number(body.querySelector("h6").innerText.slice(14, 15));

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
      // console.log("section: ", section);

      /*
        Splits like this
        0 - Task Name, Course
        1 - P that houses mentor name, Date submitted and date completed
        2 < - Review blocks 
      */
      let parts = section.split("<p>");

      parts = parts.map((paragraph, index) => {
        paragraph = paragraph.trim();

        if (index == 1) {
          return addPill("<p>" + paragraph);
        }
        // Skips details and score
        if (index < 2) return paragraph;

        // If the paragraph starts with </p>, add it to the previous paragraph
        if (paragraph.indexOf("</p>") == 0) {
          parts[index - 1] = parts[index - 1] + parts[index];
          return;
        }

        // Get the length between the last closing tag and the end of the paragraph
        let lastClosingTag = paragraph.slice(
          paragraph.lastIndexOf("</p>") + 4,
          paragraph.length
        ).length;
        // If it is at the end of the paragraph, remove the closing tag
        if (lastClosingTag == 0) {
          paragraph = paragraph.substring(0, paragraph.length - 4);
        }

        //! CLEAN UP SECTION
        /* 
        * If the paragraph contains either of the keys, slice it and add it to the end
        * The paragraph will be trimmed to remove it from the end
        */

        let end = "";
        let afterClosingTagHR = paragraph.lastIndexOf(KEYFORHR);
        let afterClosingTagExtra = paragraph.lastIndexOf(KEYFOREXTRA);
        // If the paragraph contains either of the keys
        if (afterClosingTagHR != -1 || afterClosingTagExtra != -1) {
          if (afterClosingTagHR != -1) {
            end = paragraph.slice(afterClosingTagHR).trim();
            paragraph = paragraph.substring(0, afterClosingTagHR);
          }
          if (afterClosingTagExtra != -1) {
            end = paragraph.slice(afterClosingTagExtra).trim();
            paragraph = paragraph.substring(0, afterClosingTagExtra);
          }
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
  cleanPreviousReviews();
}
