# jQuery.selectfy
A simple jQuery plugin to make list of elements selectable. This plugin is in its initial release and ready to be public tested. There are a bunch of features that could be included but it was left for next updates to keep this initial version simple.

The goal of Selectfy is to provide a simplistic framework to power user selection. The plugin does not interfer with your design by adding unsolicitaded CSS files or tying you to prefab CSS names. This will give you flexibility to make minimal to no changes to your original CSS.

## Features
* Single Select
* Multiple Selection
  * Holding `CTRL` will select and unselect specific elements
  * Holding `SHIFT` will perform a range select
  * `CTRL+SHIFT` will trigger the Highlight mode, it will be useful when Keyboard selection gets implemented
* Selection event
* Usefull functions

## How to setup
The most simplistic way to enable Selectfy is having a HTML container and a collection of immidiate children elements with an attribute ```data-selectable```. This attribute is customizable, but will be further discussed in the wiki.

```html
<div id="ListBox">
	<div data-selectable>Item 1</div>
	<div data-selectable>Item 2</div>
	<div data-selectable>Item 3</div>
</div>
```

```javascript
$(document).ready(function(){
	$('#ListBox').selectfy();
});
```

Once the page loads, if  you click over any Item div, it will receive two classes: ```selected``` and ```highlighted```. Those names are customizable. All you have to do is to create a CSS to add some style to a selected element. Highlighted is optional and it's only useful when this plugin start supporting keyboard selection.

### Passing options
If you initialize this plugin, it assume the default configuration, but you can customize all of them. Here are the default options explicited:
```javascript
$('#ListBox').selectfy({
    shiftSelect: true,                // Enable Shift Select
    ctrlSelect: true,                 // Enable Ctrl Select
    selectable: '[data-selectable]',  // jQuery selector to find selectable items inside its container
    selectedClass: 'selected',        // Selected class applied to the item
    highlightClass: 'highlighted'     // Highlighted class applied to the item
  });
```

Disabling shiftSelect and ctrlSelect together, will transform your list into a single-select list.

## Public functions

### Select and unselect all items
When called, it selects all or unselects all items from the collection of selectable collection:
```javascript
$('#SelectItemContainer').selectfy('selectAll');

$('#SelectItemContainer').selectfy('unselectAll');
```

### Get all elements selected
Get all selected elements in jQuery object array
```javascript
var selected = $('#SelectItemContainer').selectfy('getSelected');
console.log(selected);
```

### Get selected count
If a piece of code needs to know the current selection count, it can ask through this method
```javascript
var selectedCount = $('#SelectItemContainer').selectfy('getCount');
console.log(selectedCount);
```

## Events

### Selection Change
Every time a selection or an unselection happens, the ```change.selectfy``` jQuery event is raised, and it receives an Object as a parameter. The event triggers once on every single click, ```CTRL``` click, and ```SHIFT``` click. If you hold ```CTRL+SHIFT```, the highlight will happen but not the event.

Example:
```javascript
$('#SelectItemContainer').on('change.selectfy', function (sender, details) {
  // Your handler here
});
```

This is a inside view of what it's being passed on ```details``` parameter:
```javascript
{
  selectedCount: 0,    /* Total selected elements count */
  selected: [Object, ...]    /* Array of what is currently selected */
}
```

## Questions and Problems
Please report on the [Issues](https://github.com/dorival/jquery.selectfy/issues) section. I also gladly accept pushes that fixes bugs, just help the project by creating an Issue that describes the bug you are fixing :)
