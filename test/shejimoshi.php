<?php
/**
 * 简单工厂模式
 */
Interface IOperation{
    /**
     * @return int
     */
    public function getResult();
}
class Operation{
    private $num1 = 0;
    private $num2 = 0;

    /**
     * @return int
     */
    public function getNum1(){
        return $this->num1;
    }

    /**
     * @param int $num1
     */
    public function setNum1($num1){
        $this->num1 = $num1;
    }

    /**
     * @return int
     */
    public function getNum2(){
        return $this->num2;
    }

    /**
     * @param int $num2
     */
    public function setNum2($num2){
        $this->num2 = $num2;
    }
}
class OperationAdd extends Operation implements IOperation{
    /**
     * @return int
     */
    public function getResult(){
        // TODO: Implement getResult() method.
        return ($this->getNum1() + $this->getNum2());
    }
}
class OperationSub extends Operation implements IOperation{
    /**
     * @return int
     */
    public function getResult(){
        // TODO: Implement getResult() method.
        return ($this->getNum1() - $this->getNum2());
    }
}
class OperationMul extends Operation implements IOperation{
    /**
     * @return int
     */
    public function getResult(){
        // TODO: Implement getResult() method.
        return ($this->getNum1() * $this->getNum2());
    }
}
class OperationDiv extends Operation implements IOperation{
    /**
     * @return int
     */
    public function getResult(){
        // TODO: Implement getResult() method.
        return ($this->getNum1() / $this->getNum2());
    }
}
class OperationFactory{
    public static function createOperation($operationStr){
        $operation = null;
        switch($operationStr){
            default:
            case '+':
                $operation = new OperationAdd();
                break;
            case '-':
                $operation = new OperationSub();
                break;
            case '*':
                $operation = new OperationMul();
                break;
            case '/':
                $operation = new OperationDiv();
                break;
        }
        return $operation;
    }
}
$operation = OperationFactory::createOperation('*');
$operation->setNum1(11);
$operation->setNum2(12);
//echo $operation->getResult();
/**
 * 策略模式
 */
class Cashier{
    private $goodArr = [];

    /**
     * @return array
     */
    public function getGoodArr()
    {
        return $this->goodArr;
    }

    /**
     * @param array $goodArr
     */
    public function setGoodArr($goodArr)
    {
        $this->goodArr = $goodArr;
    }
}
interface ICashierCalculator{
    /**
     * @return mixed
     */
    public function pressCalculator();
}
class NormalCashier extends Cashier implements ICashierCalculator{//正常的收银员
    /**
     * @return mixed
     */
    public function pressCalculator()
    {
        $sum = 0;
        foreach($this->getGoodArr() as $price => $num){
            $sum += $price*$num;
        }
        return $sum;
    }
}
class RebateCashier extends NormalCashier implements ICashierCalculator{//处理打折的收银员
    private $rate = 1;
    /**
     * @return mixed
     */
    public function pressCalculator()
    {
        return parent::pressCalculator()*$this->getRate();
    }

    /**
     * @return mixed
     */
    public function getRate()
    {
        return $this->rate;
    }

    /**
     * @param mixed $rate
     */
    public function setRate($rate)
    {
        if($rate > 1 && $rate < 0){
            $rate = 1;
        }
        $this->rate = $rate;
    }
}
class ReturnCashCashier extends NormalCashier implements ICashierCalculator{ //处理返回现金的 收银员
    private $condition = 0;
    private $returnCash = 0;

    /**
     * @return int
     */
    public function getCondition()
    {
        return $this->condition;
    }

    /**
     * @param int $condition
     */
    public function setCondition($condition)
    {
        $this->condition = $condition;
    }

    /**
     * @return int
     */
    public function getReturnCash()
    {
        return $this->returnCash;
    }

    /**
     * @param int $returnCash
     */
    public function setReturnCash($returnCash)
    {
        $this->returnCash = $returnCash;
    }

    /**
     * @return mixed
     */
    public function pressCalculator()
    {
        $sum = parent::pressCalculator();
        if($sum >= $this->getCondition()){
            return $sum - $this->getReturnCash();
        }else{
            return $sum;
        }
    }
}
$c = new NormalCashier();
$c->setGoodArr([100=>100]);
//echo $c->pressCalculator()."\n";
$c = new RebateCashier();
$c->setGoodArr([100=>100]);
$c->setRate(0.8);
//echo $c->pressCalculator()."\n";
$c = new ReturnCashCashier();
$c->setGoodArr([100=>100]);
$c->setCondition(9000);
$c->setReturnCash(1000);
//echo $c->pressCalculator()."\n";






