(function s(d,w) {
  var img = d.createElement('img');
  img.src = 'http://127.0.0.1:3100/statistics/count.png?screen=' + w.screen.width + '×' + w.screen.height + '&width=' + w.screen.width + '&height=' + w.screen.height + '&referrer=' + encodeURIComponent(d.referrer);
  img.style='width:0;height:0;';
  d.body.appendChild(img);
})(document, window);
