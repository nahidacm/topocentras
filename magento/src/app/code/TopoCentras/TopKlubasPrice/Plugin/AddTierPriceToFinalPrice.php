<?php

namespace TopoCentras\TopKlubasPrice\Plugin;

use Magento\Catalog\Pricing\Render\FinalPriceBox;

class AddTierPriceToFinalPrice
{
    public function beforeToHtml(FinalPriceBox $subject)
    {

        $product = $subject->getSaleableItem();

        // Load tier price if not loaded
        if (!$product->getTierPrices()) {
            $product->getResource()
                ->getAttribute('tier_price')
                ->getBackend()
                ->afterLoad($product);
        }
    }
}
