
const WEB_LOOP_DATA_URL = `https://github.com/c2000e/web-loops/blob/main/test-loop.json`;

window.onload = function() {

    const webLoop = document.getElementById("web-loop");
    const thisSite = webLoop.getAttribute("site");

    fetch(WEB_LOOP_DATA_URL)
      .then((response) => response.json())
      .then((sites) => {
          const thisSiteIndex = sites.findIndex(
              (site) => site.name === thisSite
          );

          let prevSiteIndex = thisSiteIndex - 1;
          if (prevSiteIndex < 0) prevSiteIndex = sites.length - 1;

          let nextSiteIndex = thisSiteIndex + 1;
          if (nextSiteIndex > sites.length - 1) nextSiteIndex = 0;

          const mainLink = webLoop.querySelector("#main");
          const prevLink = webLoop.querySelector("#prev");
          const nextLink = webLoop.querySelector("#next");

          console.log(thisSiteIndex);
          console.log(prevSiteIndex);
          console.log(nextSiteIndex);

          mainLink.href = sites[0].url;
          prevLink.href = sites[prevSiteIndex].url;
          nextLink.href = sites[nextSiteIndex].url;
      });
}

