module.exports = 
{
	generateSerialNumber: function(n_sections, n_tokens)
	{
		var sn = '';
		for(i=0; i < n_sections; i++)
		{
			sn += (Math.random().toString(36).substr(2, n_tokens).toUpperCase());
			if(i < (n_sections - 1)) sn += '-';
		}
		return sn;
	}
}