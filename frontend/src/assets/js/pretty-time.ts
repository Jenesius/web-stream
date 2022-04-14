export default function prettyTime(seconds: number) {
	
	function addZero(m: number): string {
		if (m < 10) return `0${m}`;
		return String(m);
	}
	
	const hours = Math.floor(seconds / 3600); seconds -= hours * 3600;
	const minutes = Math.floor(seconds / 60); seconds -= minutes * 60;
	
	let output = '';
	if (hours) output += addZero(hours) + ':';
	output += addZero(minutes) + ':' + addZero(seconds);
	return output;
}
