interface TagProps {
  status: 'tsa'| 'gka' | 'buyer';
}

function Tag_Karet({ status }: TagProps) {
  let tagText = '';
  let tagColor = '';
  let textColor = '';

  if (status === 'tsa') {
    tagText = 'TSA';
    tagColor = '#FFD5D5';
    textColor = 'red';
  } else  if (status === 'gka') {
    tagText = 'TSA -> GKA';
    tagColor = '#FFFC94';
    textColor = 'orange';
  } else if (status === 'buyer') {
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