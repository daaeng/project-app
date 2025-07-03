interface TagProps {
  status: 'TSA'| 'Agro' | 'GKA' | 'Buyer';
}

function Tag_Karet({ status }: TagProps) {
  let tagText = '';
  let tagColor = '';
  let textColor = '';

  if (status === 'TSA') {
    tagText = 'TSA';
    tagColor = '#FFD5D5';
    textColor = 'red';
  } else  if (status === 'Agro') {
    tagText = 'GK Agro';
    tagColor = '#FFD5D5';
    textColor = 'red';
  } else  if (status === 'GKA') {
    tagText = 'GKA';
    tagColor = '#FFFC94';
    textColor = 'orange';
  } else if (status === 'Buyer') {
    tagText = 'GKA -> Buyyer';
    tagColor = '#B5FFBC';
    textColor = 'green';
  }

  return (
    <span style={{ backgroundColor: tagColor, color: textColor, padding: '5px 10px', borderRadius: '10px', fontSize:13 }}>
      {tagText}
    </span>
  );
}

export default Tag_Karet;