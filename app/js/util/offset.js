// Walk offsetParents
export default function(elem) {
  let top = 0;
  let left = 0;
 
  while(elem) {
    top = top + parseInt(elem.offsetTop)
    left = left + parseInt(elem.offsetLeft)
    elem = elem.offsetParent       
  }
    
  return { x: left, y: top }
}