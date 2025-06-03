import L from 'leaflet';


const iconMap = {
    'Stone circle':'cromlech',
    'Stone circle - embanked':'cromlech',
    'Stone circle - five-stone':'cromlech',
    'Stone circle - multiple-stone':'cromlech',
    'Ceremonial enclosure':'cromlech',
    'Castle - motte and bailey':'motte',
    'Castle - motte':'motte',
    'Ringfort - rath':'rath',
    'Ringfort - cashel':'rath',
    'Ringfort - unclassified':'rath',
    'Megalithic structure':'megalith',
    'Megalithic tomb':'megalith',
    'Standing stone':'standing stone',
    'Stone row':'stone row',
    'Cairn':'cairn'
};

function Icon(site, selected=false)
{
    const patch = iconMap[site.classdesc]?iconMap[site.classdesc]:'monument';
    const iconPath = `/img/${patch}.png`;
    const scale = selected?1.25:1;
    const classNames = ['leaflet-marker-icon'];
    if(selected) classNames.push('selected');

    return new L.divIcon({
        html: `<div class="icon-marker leaflet-marker-icon ${selected ? 'selected' : ''}">
           <img src="${iconPath}" />
         </div>`,
        iconAnchor: [16*scale, 37*scale],
        className:classNames.join(' '),
        iconSize: new L.Point(32*scale, 37*scale)
    });
}

export default Icon;


