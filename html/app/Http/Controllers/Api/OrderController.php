<?php

namespace App\Http\Controllers\Api;

use App\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class OrderController extends Controller
{
    /**
     * @param Request $request
     * @return Request
     * @throws \Exception
     */
    public function create(Request $request) {
        while (true) {
            $max = pow(10, 4) - 1;
            $rand = random_int(0, $max);
            $code = sprintf('%04d', $rand);
            if(!Order::where('confirm', $code)->first())
                break;
        }
        $order = new Order();
        $order->data = json_encode($request->input(), JSON_UNESCAPED_UNICODE);
        $order->payd = false;
        $order->confirm = $code;
        $order->save();

        return $order->id;
    }

    /**
     * @param Order $order
     * @return mixed
     */
    public function get(Order $order) {
        $data = json_decode($order->data);
        return [
            'confirm' => $order->confirm,
            'pay' => $data->pay
        ];
    }
}
