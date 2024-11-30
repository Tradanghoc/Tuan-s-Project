<?php
require_once('./index.php');
require 'vendor/autoload.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: Post");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$secretKey = 'sk_test_51OsaA1AFTGMMMmVwrTy65JKAW5GUsRQAaMh8sFTGYIeNdtukbxAH2J72I15SwbgPBIJrIry8ruDxZ4kDfHdkzW9400ukUPgs2H';
\Stripe\Stripe::setApiKey($secretKey);

try {
  $customer = \Stripe\Customer::create(); // create a new customer
  $paymentIntent = \Stripe\PaymentIntent::create([
    'amount' => 1000, // replace with your amount
    'currency' => 'usd', // replace with your currency
    'customer' => $customer->id,
  ]);

  $ephemeralKey = \Stripe\EphemeralKey::create(
    ["customer" => $customer->id],
    ["stripe_version" => "2023-10-16"]
  );

  // Return the client secret
  echo json_encode([
    'paymentIntent' => $paymentIntent,
    'ephemeralKey' => $ephemeralKey,
    'customer' => $customer->id,
  ]);
} catch (\Stripe\Exception\ApiErrorException $e) {
  // Handle error
  echo json_encode(['error' => $e->getMessage()]);
}
?>
