/*!
 * Ankia-Theme v1.7
 * https://ankia.top/
 *
 * Licensed Apache-2.0 © 东东
 */

// ----------------------------------------------------------------------
// Parts from assets/scripts.js

async function fetchNote(noteId = null) {
  if (!noteId) {
    noteId = document.body.getAttribute("data-note-id");
  }

  const resp = await fetch(`api/notes/${noteId}`);

  return await resp.json();
}

// src/scripts/modules/mermaid.ts
async function setupMermaid() {
  const mermaidEls = document.querySelectorAll("#content pre code.language-mermaid");
  if (mermaidEls.length === 0) {
    return;
  }
  const mermaid = (await import("./mermaid.core-TRORSKKS.js")).default;
  for (const codeBlock of mermaidEls) {
    const parentPre = codeBlock.parentElement;
    if (!parentPre) {
      continue;
    }
    const mermaidDiv = document.createElement("div");
    mermaidDiv.classList.add("mermaid");
    mermaidDiv.innerHTML = codeBlock.innerHTML;
    parentPre.replaceWith(mermaidDiv);
  }
  mermaid.init();
}

// src/scripts/modules/math.ts
async function setupMath() {
  const anyMathBlock = document.querySelector("#content .math-tex");
  if (!anyMathBlock) {
    return;
  }
  const renderMathInElement = (await import("./auto-render-UXC7LJGS.js")).default;
  await import("./mhchem-DNUT7O3K.js");
  const contentEl = document.getElementById("content");
  if (!contentEl) return;
  renderMathInElement(contentEl);
  document.body.classList.add("math-loaded");
}

// src/scripts/index.ts
function $try(func, ...args) {
  try {
    func.apply(func, args);
  } catch (e) {
    console.error(e);
  }
}

function setupTextNote() {
  $try(setupMermaid);
  $try(setupMath);
}

function determineNoteType() {
  const bodyClass = document.body.className;
  const match = bodyClass.match(/type-([^\s]+)/);
  return match ? match[1] : null;
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const noteType = determineNoteType();
    if (noteType === "text") {
      setupTextNote();
    }
  },
  false
);

// ----------------------------------------------------------------------

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const toggleMenuButton = document.getElementById("toggleMenuButton");
    const mobileMenuContainer = document.getElementById("mobileMenuContainer");
    const bloggerInfoCard = document.getElementById("bloggerInfoCard");
    const menuCard = document.getElementById("menuCard");
    const main = document.getElementById("main");

    let isCardsAdded = false;

    toggleMenuButton.addEventListener("click", () => {
      toggleMenuButton.classList.toggle("active");
      if (!isCardsAdded) {
        bloggerInfoCard.style.setProperty("display", "flex", "important");
        menuCard.style.setProperty("display", "flex", "important");
        mobileMenuContainer.appendChild(bloggerInfoCard);
        mobileMenuContainer.appendChild(menuCard);
        main.style.display = "none";
        isCardsAdded = true;
      } else {
        mobileMenuContainer.removeChild(bloggerInfoCard);
        mobileMenuContainer.removeChild(menuCard);
        main.style.display = "block";
        isCardsAdded = false;
      }

      mobileMenuContainer.classList.toggle("showMenu");
    });
  },
  false
);
document.addEventListener(
  "DOMContentLoaded",
  () => {
    var navigationItems = document.querySelectorAll(".navigationItemsStyle");
    // Add listener to each .navigationItemsStyle element
    navigationItems.forEach(function (item) {
      var button = item.querySelector(".menuLinkStyle");
      var dropDown = item.querySelector(".dropDownStyle");
      if (!button || !dropDown) {
        return;
      }
      var iElement = button.querySelector("i");
      let isHovering = false;

      button.addEventListener("mouseover", function () {
        isHovering = true;
        dropDown.style.display = "flex";

        iElement.classList.add("unfolding");
      });

      button.addEventListener("mouseout", function () {
        isHovering = false;
        setTimeout(function () {
          if (!isHovering) {
            dropDown.style.display = "none";
            iElement.classList.remove("unfolding");
          }
        }, 200);
      });

      dropDown.addEventListener("mouseover", function () {
        isHovering = true;
      });

      dropDown.addEventListener("mouseout", function () {
        isHovering = false;
        setTimeout(function () {
          if (!isHovering) {
            dropDown.style.display = "none";
            iElement.classList.remove("unfolding");
          }
        }, 200);
      });
    });
  },
  false
);
document.addEventListener(
  "DOMContentLoaded",
  () => {
    var prevScrollPos = window.pageYOffset;
    const scrollDistance = 10;

    window.onscroll = function () {
      var currentScrollPos = window.pageYOffset;
      const navigationBar = document.getElementById("navigationBar");
      if (prevScrollPos > currentScrollPos) {
        navigationBar.classList.remove("hide");
      } else if (
        currentScrollPos - prevScrollPos > scrollDistance &&
        !document.querySelector("#mobileMenuContainer.showMenu")
      ) {
        navigationBar.classList.add("hide");
      }

      prevScrollPos = currentScrollPos;
    };
  },
  false
);

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const rewardBtn = document.getElementById("rewardBtn");
    const rewardImgContainer = document.getElementById("rewardImgContainer");
    if (rewardBtn) {
      rewardBtn.addEventListener("click", function () {
        if (rewardImgContainer.style.display === "flex") {
          rewardImgContainer.style.opacity = "0";
          setTimeout(function () {
            rewardImgContainer.style.display = "none";
            rewardImgContainer.style.flexWrap = "";
          }, 500);
        } else {
          rewardImgContainer.style.opacity = "1";
          rewardImgContainer.style.display = "flex";
          rewardImgContainer.style.flexWrap = "wrap";
        }
      });
    }
  },
  false
);

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const toc = document.getElementById("toc");
    if (!toc) return;
    const tocHeight = toc.clientHeight;

    const sections = document.querySelectorAll(
      "#content h2, #content h3, #content h4, #content h5, #content h6"
    );
    const links = toc.querySelectorAll("a");

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const target = document.getElementById(
          link.getAttribute("href").slice(1)
        );
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });

    function changeLinkState() {
      let index = sections.length;
      while (--index && window.scrollY < sections[index].offsetTop) { }

      links.forEach((link) => link.classList.remove("tocActive"));
      links[index].classList.add("tocActive");
    }

    function scrollToc() {
      const toc = document.getElementById("toc-pane");
      const tocContent = document.getElementById("toc");
      const tocHeight = parseFloat(
        window.getComputedStyle(toc).getPropertyValue("max-height")
      );
      let activeElement = toc.querySelector(".tocActive");
      let activeElementPosition = activeElement.offsetTop;
      if (activeElementPosition > tocHeight - 50) {
        toc.scrollTo({ top: 9999, behavior: "smooth" });
      } else if (
        tocContent.offsetHeight - activeElementPosition >
        tocHeight - 50
      ) {
        toc.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    changeLinkState();
    window.addEventListener("scroll", () => {
      changeLinkState();
      setTimeout(scrollToc, 500);
    });
  },
  false
);

document.addEventListener(
  "DOMContentLoaded",
  () => {
    if (!document.queryCommandSupported("copy")) {
      return;
    }

    function flashCopyMessage(button, message) {
      button.textContent = message;
      setTimeout(function () {
        button.textContent = "Copy";
      }, 1000);
    }

    function selectText(node) {
      var selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
      return selection;
    }

    function addCopyButton(container) {
      var copyButton = document.createElement("button");
      copyButton.className = "copyButtonStyle";
      copyButton.textContent = "Copy";
      copyButton.setAttribute("title", "Copy");

      var codeElement = container.firstElementChild;
      copyButton.addEventListener("click", function () {
        try {
          var selection = selectText(codeElement);
          document.execCommand("copy");
          selection.removeAllRanges();

          flashCopyMessage(copyButton, "Copied!");
        } catch (error) {
          console && console.log(error);
          flashCopyMessage(copyButton, "Failed");
        }
      });

      container.appendChild(copyButton);
    }

    var preBlocks = document.querySelectorAll("pre");
    Array.prototype.forEach.call(preBlocks, addCopyButton);
  },
  false
);

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const target = document.getElementById("onTop");
    target.addEventListener("click", (e) => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  },
  false
);

document.addEventListener(
  "DOMContentLoaded",
  () => {
    // Word count
    const content = document.getElementById("content");
    if (!content) {
      return;
    }
    const articleWordCount = document.getElementById("articleWordCount");
    articleWordCount.innerText = content.innerText
      .split(/[\s-+:,/\\]+/)
      .filter((chunk) => chunk !== "")
      .length;
  },
  false
);

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const messageElements = document.querySelectorAll('#blogItemSummary');

    function updateText() {
      messageElements.forEach(element => {
        const fullText = element.getAttribute('data-fulltext') || element.textContent;
        // Store original fullText in a data attribute if not already stored
        if (!element.hasAttribute('data-fulltext')) {
          element.setAttribute('data-fulltext', fullText);
        }
        if (window.matchMedia("(max-width: 600px)").matches) {
          element.textContent = fullText.substring(0, 120) + "...";
        } else {
          element.textContent = fullText;
        }
      });
    }

    // Initial run
    updateText();

    // Update on resize
    window.addEventListener('resize', updateText);
  },
  false
);

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const searchContainer = document.getElementById("searchContainer");
    const searchButton = document.getElementById("searchButton");

    function buildResultItem(result) {
      return `<a class="searchItems" href="./${result.id}">
                    <div class="itemsTitle">${result.title}</div>
                </a>`;
    }
    function debounce(executor, delay) {
      let timeout;
      return function (...args) {
        const callback = () => {
          timeout = null;
          Reflect.apply(executor, null, args);
        };
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
      };
    }

    async function performSearch() {
      const searchTerm = searchInput.value.trim();
      if (searchTerm !== "") {
        searchResults.innerHTML = "";

        const ancestor = document.body.dataset.ancestorNoteId;
        const query = searchInput.value;
        const resp = await fetch(
          `api/notes?search=${query}&ancestorNoteId=${ancestor}`
        );
        const json = await resp.json();
        const results = json.results;
        for (const result of results) {
          searchResults.innerHTML += buildResultItem(result);
        }
      }
    }
    searchButton.addEventListener("click", () => {
      searchContainer.style.display = "flex";
    });

    searchInput.addEventListener(
      "keyup",
      debounce(async () => {
        await performSearch();
      }, 400)
    );

    document.addEventListener("click", (event) => {
      if (
        !event.target.closest("#searchContainer") &&
        !event.target.closest("#searchButton")
      ) {
        searchContainer.style.display = "none";
      }
    });
  },
  false
);
