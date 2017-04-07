<!DOCTYPE html> 
<html>
	<head>
		<title>list/grid dev</title>

		<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
		<script src="scripts/list-grid-plugin.js"></script>

		<link href="styles/font-awesome/css/font-awesome.min.css" rel="stylesheet">
		<link href="styles/styles.css" rel="stylesheet">
	</head>
	<body>
		<h1>list/grid dev</h1>

		<!---<p class="clearfix"><a id="toggler" class="btn btn-primary pull-right"><!---<i class="fa fa-list" aria-hidden="true"></i>---><i class="fa fa-th" aria-hidden="true"></i> Switch to Grid</a></p>--->

		<div class="resultset">
			<ul class="list-grid-ul">
				<cfloop from="1" to="5" index="current">
					<li>
						<div class="thumb">
							<img src="images/<cfoutput>#current#</cfoutput>.jpg" alt="gallery image or whatever" />
						</div>
						<div class="data">
							<div><b>This is the title</b></div>
							<div>01/01/2017</div>
							<div>Lorem ipsum ding dong dang</div>
						</div>
					</li>
				</cfloop>
			</ul>
		</div>

		<script>
			$('.resultset').listGrid();
		</script>
	</body>
</html>

