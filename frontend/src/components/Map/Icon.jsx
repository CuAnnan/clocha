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

function Icon({classdesc})
{
    const patch = iconMap[classdesc]?iconMap[classdesc]:'monument';
    const icon = `../img/${patch}.png`;

    return new L.Icon({
        iconUrl: icon,
        iconRetinaUrl: icon,
        iconAnchor: "bottom",
        iconSize: new L.Point(32, 37)
    })
}

export default Icon;


