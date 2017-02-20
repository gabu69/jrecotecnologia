<?php
require '../phplib/autoload.php';

$app = new \Slim\Slim();

function enviarCorreo($datos) {
	
	$myFile = $_SERVER['DOCUMENT_ROOT'].'/../_archivo.txt';
	$fh = fopen($myFile, 'r');
	$passw = fgets($fh);
	fclose($fh);
	
	$mailer = new PHPMailer;
	$mailer->isSMTP();
	$mailer->Host = 'rmx11.dizinc.com';
	$mailer->SMTPAuth = true;
	$mailer->Username = 'webmaster@jrecotecnologia.com';
	$mailer->Password = $passw;
	$mailer->SMTPSecure = 'ssl';
	$mailer->Port = 465;
	$mailer->isHTML(true);
	
	$cc = 'contacto@jrecotecnologia.com';
	$nombre = $datos['nombre'];
	$reply = $datos['correo'];
	$titulo = $datos['_subject'];
	$sheet = '';

	if ( !empty($datos['recibo']) ) {
		list($type, $data) = explode(';', $datos['recibo']);
		list(,$type) = explode(':',$type);
		list(,$extension) = explode('/',$type);
		list(, $data) = explode(',', $data);
		$attachmentData = base64_decode( $data );
		$mailer->AddStringAttachment($attachmentData, "recibo." . $extension, 'base64', $type);
		unset($datos['recibo']);

		$sheet = 'nomandar';
	}

	$body = '';
	$parametros = '';
	foreach ($datos as $key => $value) {
		if ($key == 'intereses') {
			$body = $body.$key.': ';
			$parametros = $parametros.'&'.$key.'=\'';
			foreach ($value as $key => $value) {
				$body = $body.filter_var($value, FILTER_SANITIZE_STRING).', ';
				$parametros = $parametros.urlencode(filter_var($value, FILTER_SANITIZE_STRING)).',';
			}
			$body = $body.'<br />';
			$parametros = $parametros.'\'';
		} elseif (substr( $key, 0, 1 ) !== '_') {
			$body = $body.$key.': '.filter_var($value, FILTER_SANITIZE_STRING).'<br />';
			$parametros = $parametros.'&'.$key.'=\''.urlencode(filter_var($value, FILTER_SANITIZE_STRING)).'\'';
		}
	}
	$parametros = ltrim($parametros, '&');
	if ($sheet == '') {
		$resp = guardarSheet($parametros);
	}

	$mailer->clearAllRecipients();
	$mailer->setFrom('webmaster@jrecotecnologia.com', 'Sitio Web JR Ecotecnologia');
	$mailer->addAddress('webmaster@jrecotecnologia.com', 'webmaster');
	$mailer->addReplyTo($reply, $nombre);
	$mailer->addCC($cc);

	$mailer->Subject = $titulo;
	$mailer->Body    = $body;
	$mailer->AltBody = $body;

	if(!$mailer->send()) {
		return $mailer->ErrorInfo;
	} else {
		return 'enviado';
	}
}

function guardarSheet($parametros) {
	$sheet = 'https://script.google.com/macros/s/AKfycbyrKg6jJ5OMl4pDpcRvhE6HHm7oWqKqoenT3cEHfqHW2Jvzck12/exec?';

	$url = $sheet . $parametros;

	// Get cURL resource
	$curl = curl_init();
	// Set some options - we are passing in a useragent too here
	curl_setopt_array($curl, array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_URL => $url
	));
	// Send the request & save response to $resp
	$resp = curl_exec($curl);
	// Close request to clear up some resources
	curl_close($curl);

	return $resp.'<br />'.$url;
}

$app->post('/contacto', function () use ($app) {

	$request = $app->request();
	$post = $app->request->post();

	$respuesta = array();
	$errores = array();

	if ( empty($post['_gotcha']) ) {
		if ( !isset( $post['correo'] ) || empty( $post['correo'] ) || !filter_var( trim( $post['correo'] ), FILTER_VALIDATE_EMAIL ) ) 
		{
			$errores['correo'] = 'Es necesario el correo';
		}
		elseif ( !isset( $post['nombre'] ) || empty( $post['nombre'] ) )
		{
			$errores['nombre'] = 'Es necesario el nombre';
		}
		else
		{
			if ( $_SERVER['HTTP_HOST'] != 'jr-ecotecnologia-joseanu.c9users.io' ) {
				$correo = enviarCorreo($post);
				if ( $correo == 'enviado' ) {
					$respuesta['ok'] = 'Gracias por contactarnos. Recibimos tus datos y en breve nos comunicaremos.';
				} else {
					$errores['correo'] = $correo;
				}
			}
			else
			{
				$respuesta['ok'] = 'Gracias por contactarnos. Recibimos tus datos y en breve nos comunicaremos.';
			}
		}

		if ( count($errores) > 0 ) {
			$respuesta['errores'] = $errores;
		}

		$app->response->write( json_encode($respuesta) );
	}
	else
	{
		$app->response->write( 'mal' );
	}
});

$app->post('/cotizar', function () use ($app) {

	$request = $app->request->getBody();
	$post = json_decode($request);
	
	$headers = $app->request->headers;

	$respuesta = array();
	$errores = array();
	
	if ( empty($post->_gotchaz) ) {
		if ( empty( $post->correo ) || !filter_var( trim( $post->correo ), FILTER_VALIDATE_EMAIL ) ) 
		{
			$errores['correo'] = 'Es necesario el correo';
		}
		elseif ( empty( $post->nombre ) )
		{
			$errores['nombre'] = 'Es necesario el nombre';
		}
		else
		{
			if ( $_SERVER['HTTP_HOST'] != 'jr-ecotecnologia-joseanu.c9users.io' ) {
				$arr = (array)$post;
				$arr['_subject'] = 'Solicitud para Cotizar Sistema Fotovoltaico';
				unset($arr['errores']);
				unset($arr['gotchaz']);
				$correo = enviarCorreo($arr);

				if ( $correo == 'enviado' ) {
					$respuesta['ok'] = 'Gracias por contactarnos. Recibimos tus datos y en breve nos comunicaremos.';
				} else {
					$errores['correo'] = $correo;
				}
			}
			else
			{
				$respuesta['ok'] = 'Gracias por contactarnos. Recibimos tus datos y en breve nos comunicaremos.';
			}
		}

		if ( count($errores) > 0 ) {
			$app->response->setStatus(422);
			$respuesta = $errores;
		}

		$app->response->write( json_encode($respuesta) );
	}
	else
	{
		$app->response->write( 'mal' );
	}
});

$app->run();