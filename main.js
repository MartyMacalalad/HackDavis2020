
const resultsDiv = document.querySelector('.results')
    resultsDiv.innerHTML = `Labels:`
    labels.forEach(label => output(label.description));

var output = (data)=> {
  const html = `${data}`
  const resultsDiv = document.querySelector('.results')
  var label = document.createElement('span');
  label.innerHTML = html;
  resultsDiv.appendChild(label)
}
