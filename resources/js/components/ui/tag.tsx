interface TagProps {
  status: 'belum ACC' | 'ditolak' | 'diterima';
}

function Tag({ status }: TagProps) {
  let tagText = '';
  let tagColor = '';
  let textColor = '';

  if (status === 'belum ACC') {
    tagText = 'Process';
    tagColor = '#FFFC94';
    textColor = 'orange';
  } else if (status === 'ditolak') {
    tagText = 'Rejected';
    tagColor = '#FFD5D5';
    textColor = 'red';
  } else if (status === 'diterima') {
    tagText = 'Accepted';
    tagColor = '#B5FFBC';
    textColor = 'green';
  }

  return (
    <span style={{ backgroundColor: tagColor, color: textColor, padding: '5px 10px', borderRadius: '30px', fontSize:13 }} className="px-2 py-1 rounded-full text-xs font-semibold">
      {tagText}
    </span>
  );
}

export default Tag;